<template>
  <PageWrapper>
    <h1 :class="$style.Heading">
      Gene mutation data
    </h1>

    <div :class="$style.AdvancedModeSwitchWrapper">
      <MDBSwitch
        v-model="useAdvancedMode"
        :class="$style.AdvancedModeSwitch"
        label="Advanced search"
      />
    </div>

    <Spinner v-if="isFetchingData" :class="$style.PageSpinner" />
    <div v-else-if="errorMessage.length === 0">
      <div v-if="useAdvancedMode">
        <div v-if="!isFetchingData" :class="$style.ComponentWrapper">
          <div v-if="filters.length !== 0" :class="$style.FiltersWrapper">
            <p> Filters: </p>
            <ul>
              <li
                v-for="(filter, index) in filters"
                :key="index"
                :class="$style.FilterListItem"
                @click="deleteFilter(index)"
              >
                {{ filter.fieldPath }} {{ filter.opStr }} {{ filter.value }}
                <span :class="$style.DeleteFilterSpan">x</span>
              </li>
            </ul>
          </div>

          <p>
            Please add a filter
            <span :class="$style.FilterInstruction">(using text in brackets if it is a default column)</span>:
          </p>

          <div :class="$style.FilterWrapper">
            <div :class="$style.InputWrapper">
              <MDBInput
                v-model="queryInput"
                label="Attribute"
                type="text"
                :class="$style.Input"
              />
            </div>

            <div :class="$style.SelectWrapper">
              <select v-model="selectedOperator" :class="[$style.Select, 'form-select']">
                <option
                  v-for="operation in Object.entries(fireStoreOperators)"
                  :key="operation"
                  :disabled="operation[1] === 'Please select'"
                >
                  {{ operation[1] }}
                </option>
              </select>
            </div>

            <div :class="$style.InputWrapper">
              <MDBInput
                v-model="queryOperand"
                label="Value"
                type="text"
                :class="$style.Input"
              />
            </div>

            <MDBBtn
              color="primary"
              :disabled="!canSubmitFilter"
              @click="addFilter"
            >
              Add filter
            </MDBBtn>
          </div>
        </div>
      </div>

      <div v-else>
        <p :class="$style.GeneMutationSelection">
          Select a gene mutation:
        </p>
        <div :class="[$style.SelectWrapper, $style.GeneMutationWrapper]">
          <select v-model="selectedGeneMutation" :class="[$style.Select, 'form-select']">
            <option
              v-for="geneMutation in geneMutations"
              :key="geneMutation"
              :disabled="geneMutation === 'Please select'"
            >
              {{ geneMutation }}
            </option>
          </select>
        </div>
      </div>

      <div :class="$style.CheckboxWrapper">
        <p>Selected columns:</p>
        <MDBCheckbox
          v-for="(key, index) in mapMutationToWords(Object.keys(optionalTableKeys)).sort(Intl.Collator().compare)"
          :key="index"
          v-model="activeCheckboxes[key]"
          :label="mapMutationToWords(key)"
          inline
          @change="toggleKey(key)"
        />
      </div>

      <p :class="$style.GraphPrompt">
        Click a table header to view a graph on the data
      </p>
      <div :class="$style.TableWrapper">
        <p>Results ({{ filteredResults.length }}):</p>

        <Spinner v-if="isLoadingGraph" />
        <div id="chart" />

        <p
          v-for="index in Math.ceil(filteredResults.length / pageSize)"
          :key="index"
          :class="[$style.PaginationOptions, index === selectedTablePage ? $style.SelectedPaginationOption : '']"
          @click="selectedTablePage = index"
        >
          {{ index }}
        </p>

        <MDBTable
          bordered
          striped
          :class="$style.Table"
        >
          <thead>
            <tr>
              <th
                v-for="(key, index) in activeTableKeys"
                :key="index"
                scope="col"
                :class="$style.TableHeaderCell"
                @click="selectGraphKey(key)"
              >
                <p :class="$style.TableHeaderText">
                  {{ mapMutationToWords(key) }}
                  {{ key[0] !== mapMutationToWords(key)
                    ? `(${key})`
                    : null
                  }}
                </p>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(dataItem, outerIndex) in renderableResults" :key="outerIndex">
              <td v-for="(key, innerIndex) in activeTableKeys" :key="innerIndex">
                {{ dataItem[key] }}
              </td>
            </tr>
          </tbody>
        </MDBTable>
      </div>
    </div>
    <div v-else>
      <p :class="$style.ErrorOccuredText">
        An error occured while fetching data:
      </p>
      <p :class="$style.ErrorOccuredText">
        {{ errorMessage }}
      </p>
    </div>
  </PageWrapper>
</template>

<script>
  import PageWrapper from '../../components/PageWrapper/PageWrapper.vue';
  import Spinner from '../../components/Spinner/Spinner.vue';
  import determineKeys from '../../utils/determineKeys';
  import mapMutationToWords from '../../utils/mapMutationToWords';
  import fetchDocuments from '../../utils/fetchDocuments';
  import { GoogleCharts } from 'google-charts';
  import { MDBBtn, MDBCheckbox, MDBInput, MDBSwitch, MDBTable } from 'mdb-vue-ui-kit';
  import { isValid } from '../../utils/validationFunctions';
  import { reactive, ref, watch } from 'vue';

  export default {
    name: 'Query',
    components: {
      MDBBtn, MDBCheckbox, MDBInput, MDBSwitch, MDBTable, PageWrapper, Spinner
    },
    setup() {
      let activeCheckboxes = ref({});
      const activeTableKeys = ref([
        'ledv',
        'redv',
        'lesv',
        'resv',
        'lvef',
        'rvef',
        'lvmass',
        'lsv',
        'rsv',
        'scar',
        'Gender',
        'AgeatMRI',
        'ApicalHCM',
        'SuddenCardiacDeath',
        'Hypertension',
        'Diabetes',
        'Myectomy'
      ]);
      let allDocuments = [];
      let displayChart = ref(false);
      let errorMessage = ref('');
      const fireStoreOperators = {
        '': 'Please select',
        '==': 'equal to',
        '<': 'less than',
        '<=': 'less than or equal to',
        '>': 'greater than',
        '>=': 'greater than or equal to',
        '!=': 'not equal to'
      };
      let filters = reactive([]);
      let isFetchingData = ref(false);
      let isLoadingGraph = ref(false);
      let canSubmitFilter = ref(false);
      let filteredResults = ref([]);
      const geneMutations = ref([
        'Please select',
        'MYH7',
        'MYBPC3',
        'TNNT2',
        'ACTC',
        'TPM1',
        'TNNCI',
        'TNNI3',
        'MYL2',
        'TTN'
      ]);
      let optionalTableKeys = ref([]);
      const pageSize = 15;
      let queryInput = ref('');
      let queryOperand = ref('');
      let renderableResults = ref([]);
      let selectedGeneMutation = ref('Please select');
      let selectedGraphKey = ref();
      let selectedOperator = ref('Please select');
      let selectedTablePage = ref(1);
      let useAdvancedMode = ref(false);

      (async () => {
        isFetchingData.value = true;

        try {
          allDocuments = await fetchDocuments();
          filteredResults.value = allDocuments;
          renderableResults.value = filteredResults.value.slice(0, pageSize);
          optionalTableKeys.value = determineKeys(allDocuments);

          activeTableKeys.value.forEach(key => activeCheckboxes.value[key] = true);
        } catch (error) {
          switch(true) {
          case error.message.includes('Network Error'):
            errorMessage.value = 'Firebase details are setup incorrectly';
            break;
          case error.message.includes('multi-tab'):
            errorMessage.value = 'Only one tab can be open at a time in development mode';
            break;
          default:
            console.error(error);
            errorMessage.value = error.message;
          }
        }
        isFetchingData.value = false;
      })();

      const addFilter = () => {
        if(optionalTableKeys.value[queryInput.value] === undefined) {
          alert('Attribute not found in database'); return;
        }

        const operandValidationMessage = isValid(queryOperand.value);
        if (!operandValidationMessage) {
          alert('Input must be a number or equal to true or false'); return;
        }

        filters.push({
          fieldPath: queryInput.value,
          opStr: Object.keys(fireStoreOperators).find(key => fireStoreOperators[key] === selectedOperator.value),
          value: convertValueToType(queryOperand.value)
        });
      };

      const convertValueToType = (value) => {
        switch(true) {
        case value === 'true' || value === 'True':
          return true;
        case value === 'false' || value === 'False':
          return false;
        default:
          return Number(value);
        }
      };

      const deleteFilter = (index) => filters = filters.slice(index, 1);

      const extractDataFromResults = (keyName) => {
        let data = {};
        let type;

        switch(typeof(filteredResults.value[0][keyName])) {
        case 'boolean':
          type = 'pie';
          break;
        case 'number':
          type = 'bar';
          break;
        case 'string':
          type = 'pie';
          break;
        }

        let counter = 0;
        filteredResults.value.forEach((doc) => {
          const keyValue = doc[keyName];

          switch (typeof keyValue) {
          case 'boolean':
            // add key to object if it doesn't exist
            if (!data[keyValue]) data[keyValue] = [];

            data[keyValue] = ++data[keyValue];
            break;
          case 'number':
            if (!data[counter]) data[counter] = [];

            data[counter] = keyValue;
            counter++;
            break;
          case 'string':
            if (!data[keyValue]) data[keyValue] = 0;

            data[keyValue] = ++data[keyValue];
            break;
          }
        });

        return { data: Object.entries(data), type };
      };

      const generateGraph = (keyName) => {
        isLoadingGraph.value = true;

        const { data, type } = extractDataFromResults(keyName);
        data.unshift(['Test', 'Value']);

        data.forEach((curData) => curData[0] = curData[0][0].toUpperCase()
          + curData[0].slice(1).toLowerCase());

        GoogleCharts.load(() => renderGraph(data, keyName, type));
      };

      const renderGraph = (data, keyName, type) => {
        const chartHelper = GoogleCharts.api.visualization;
        const chartData = chartHelper.arrayToDataTable(data);
        chartData.sort([{ column: 1, asc: true }]);

        const divToRenderChart = document.getElementById('chart');

        const chart = type === 'pie' ? new chartHelper.PieChart(divToRenderChart) :
          new chartHelper.ColumnChart(divToRenderChart);

        chart.draw(chartData, {
          title: mapMutationToWords(keyName),
          is3D: true,
          vAxis: {
            title: 'Value'
          },
          hAxis: {
            title: 'Record from database'
          },
          chartArea: { width: '82%', height: '80%' }
        });
        isLoadingGraph.value = false;
        displayChart.value = true;
      };

      const selectGraphKey = (key) => selectedGraphKey.value = key;

      const toggleKey = (key) => {
        if(activeTableKeys.value.includes(key)) {
          activeTableKeys.value.slice(activeTableKeys.value.indexOf(key), 1);
          delete activeCheckboxes[key];
        } else {
          activeTableKeys.value.push(key);
          activeCheckboxes[key] = true;
        }
      };

      watch(filters, async () => {
        let intermediateResults = allDocuments;
        filters.forEach(filter => {
          intermediateResults = intermediateResults.filter(doc => {
            const value = doc[filter.fieldPath];
            const operator = filter.opStr;

            switch (operator) {
            case '==':
              return value === filter.value;
            case '<':
              return value < filter.value;
            case '<=':
              return value <= filter.value;
            case '>':
              return value > filter.value;
            case '>=':
              return value >= filter.value;
            case '!=':
              return value !== filter.value;
            }
          });
        });

        filteredResults.value = intermediateResults;
        filteredResults.value.forEach(doc => console.log(doc['ledv']));

        if (displayChart.value) generateGraph(selectedGraphKey.value);
      });

      watch(selectedGraphKey, () => generateGraph(selectedGraphKey.value));

      watch([queryInput, selectedOperator, queryOperand], () => canSubmitFilter.value =
        (queryInput.value !== '' && selectedOperator.value !== 'Please select' && queryOperand.value !== '')
      );

      watch(selectedGeneMutation, () => {
        filters = [];
        filteredResults.value = allDocuments
          .filter(doc => doc[selectedGeneMutation.value]);
        selectedTablePage.value = 1;
      });

      // paginate table:
      watch(selectedTablePage, () => {
        const startIndex = (selectedTablePage.value - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        renderableResults.value = filteredResults.value.slice(startIndex, endIndex);
      });

      return { activeCheckboxes, activeTableKeys, addFilter, canSubmitFilter, deleteFilter, displayChart, errorMessage,
               filters, filteredResults, fireStoreOperators, geneMutations, generateGraph, isFetchingData,
               isLoadingGraph, mapMutationToWords, optionalTableKeys, pageSize, queryInput, queryOperand,
               renderableResults, selectedGeneMutation, selectGraphKey, selectedOperator, selectedTablePage, toggleKey,
               useAdvancedMode };
    }
  };
</script>

<style lang="scss" scoped module>
  @import './Query.module.scss';
</style>