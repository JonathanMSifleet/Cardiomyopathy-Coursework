<template>
  <PageWrapper>
    <h1 :class="[$style.Heading]">
      Gene mutation data
    </h1>

    <div :class="[$style.AdvancedModeSwitchWrapper]">
      <MDBSwitch
        v-model="useAdvancedMode"
        :class="[$style.AdvancedModeSwitch]"
        label="Advanced search"
      />
    </div>

    <div v-if="useAdvancedMode">
      <Spinner v-if="isFetchingData" />
      <div v-else :class="[$style.ComponentWrapper]">
        <div v-if="filters.length !== 0" :class="[$style.FiltersWrapper]">
          <p> Filters: </p>
          <ul>
            <li
              v-for="(filter, index) in filters"
              :key="index"
              :class="[$style.FilterListItem]"
              @click="deleteFilter(index)"
            >
              {{ filter.fieldPath }} {{ filter.opStr }} {{ filter.value }}
              <span :class="[$style.DeleteFilterSpan]">x</span>
            </li>
          </ul>
        </div>

        <p>
          Please add a filter
          <span :class="[$style.FilterInstruction]">(using text in brackets if it is a default column)</span>:
        </p>

        <div :class="[$style.FilterWrapper]">
          <div :class="[$style.InputWrapper]">
            <MDBInput
              v-model="queryInput"
              label="Attribute"
              type="text"
              :class="[$style.Input]"
            />
          </div>

          <div :class="[$style.SelectWrapper]">
            <select v-model="selectedOperator" :class="[$style.Select, 'form-select']">
              <option
                v-for="operation in Object.entries(fireStoreOperators)"
                :key="operation"
                :disabled="operation === 'Please select'"
              >
                {{ operation[1] }}
              </option>
            </select>
          </div>

          <div :class="[$style.InputWrapper]">
            <MDBInput
              v-model="queryOperand"
              label="Value"
              type="text"
              :class="[$style.Input]"
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
      <p :class="[$style.GeneMutationSelection]">
        Select a gene mutation:
      </p>
      <div :class="[$style.SelectWrapper, $style.GeneMutationWrapper]">
        <select v-model="selectedGeneMutation" :class="[$style.Select, 'form-select']">
          <option v-for="geneMutation in geneMutations" :key="geneMutation">
            {{ geneMutation }}
          </option>
        </select>
      </div>
    </div>

    <div :class="[$style.CheckboxWrapper]">
      <p>Selected columns:</p>
      <MDBCheckbox
        v-for="(key, index) in mapKeyNameToWords(Object.keys(optionalTableKeys)).sort(Intl.Collator().compare)"
        :key="index"
        v-model="activeTableKeys[key]"
        :label="mapKeyNameToWords(key)"
        inline
        @change="toggleKey(key)"
      />
    </div>

    <p :class="[$style.GraphPrompt]">
      Click a table header to view a graph on the data
    </p>
    <div :class="[$style.TableWrapper]">
      <p>Results ({{ renderableResults.length }}):</p>

      <Spinner v-if="isLoadingGraph" />
      <div id="chart" />

      <MDBTable
        bordered
        striped
        :class="[$style.Table]"
      >
        <thead>
          <tr>
            <th
              v-for="(key, index) in Object.entries(activeTableKeys)"
              :key="index"
              scope="col"
              :class="[$style.TableHeaderCell]"
              @click="selectGraphKey(key[0])"
            >
              <p :class="[$style.TableHeaderText]">
                {{ mapKeyNameToWords(key[0]) }}
                {{ key[0] !== mapKeyNameToWords(key[0])
                  ? '(' + key[0] + ')'
                  : null
                }}
              </p>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(dataItem, outerIndex) in renderableResults" :key="outerIndex">
            <td v-for="(key, innerIndex) in Object.entries(activeTableKeys)" :key="innerIndex">
              {{ dataItem[key[0]] }}
            </td>
          </tr>
        </tbody>
      </MDBTable>
    </div>
  </PageWrapper>
</template>

<script>
  import PageWrapper from '../../components/PageWrapper/PageWrapper.vue';
  import Spinner from '../../components/Spinner/Spinner.vue';
  import determineKeys from '../../utils/determineKeys';
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
      const activeTableKeys = ref({
        'ledv': true,
        'redv': true,
        'lesv': true,
        'resv': true,
        'lvef': true,
        'rvef': true,
        'lvmass': true,
        'lsv': true,
        'rsv': true,
        'scar': true,
        'Gender': true,
        'AgeatMRI': true,
        'ApicalHCM': true,
        'SuddenCardiacDeath': true,
        'Hypertension': true,
        'Diabetes': true,
        'Myectomy': true
      });
      let allDocuments = []; // do not edit the value of this variable
      let displayChart = ref(false);
      const fireStoreOperators = {
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
      const geneMutations = ref([
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
      let queryInput = ref('');
      let queryOperand = ref('');
      let renderableResults = ref([]);
      let selectedGeneMutation = ref('');
      let selectedGraphKey = ref();
      let selectedOperator = ref('Please select');
      let textOnlyTableKeys = [];
      let useAdvancedMode = ref(false);

      (async () => {
        isFetchingData.value = true;

        allDocuments = await fetchDocuments();
        renderableResults.value = allDocuments;

        optionalTableKeys.value = determineKeys(allDocuments);
        textOnlyTableKeys = Object.entries(optionalTableKeys.value).map(key => key[0]);

        isFetchingData.value = false;
      })();

      const addFilter = () => {
        if(!textOnlyTableKeys.includes(queryInput.value)) {
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

      const deleteFilter = (index) => filters = filters.splice(index, 1);

      const extractDataFromResults = (keyName) => {
        let data = {};
        let type;

        let counter = 0;
        renderableResults.value.forEach((doc) => {
          const keyValue = doc[keyName];

          switch (typeof keyValue) {
          case 'boolean':
            // add key to object if it doesn't exist
            if (!data[keyValue]) data[keyValue] = [];

            data[`${keyValue}`] = ++data[`${keyValue}`];
            type = 'pie';
            break;
          case 'number':
            if (!data[counter]) data[counter] = [];

            data[`${counter}`] = keyValue;
            type = 'bar';
            counter++;
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

      const mapKeyNameToWords = (key) => {
        switch(key) {
        case 'ledv':
          return 'Left ventricular end diastolic volume';
        case 'redv':
          return 'Right ventricular end diastolic volume';
        case 'lesv':
          return 'Left ventricular end systolic volume';
        case 'resv':
          return 'Right ventricular end systolic volume';
        case 'lvef':
          return 'Left ventricular ejection fraction';
        case 'rvef':
          return 'Right ventricular ejection fraction';
        case 'lvmass':
          return 'Left ventricular mass';
        case 'lsv':
          return 'Left ventricular systolic volume';
        case 'rsv':
          return 'Right ventricular systolic volume';
        case 'scar':
          return 'Fibrosis/scarring';
        case 'AgeatMRI':
          return 'Age at MRI';
        case 'ApicalHCM':
          return 'Apical Hypertrophic Cardiomyopathy';
        case 'SuddenCardiacDeath':
          return 'Sudden Cardiac Death';
        default:
          return key;
        }
      };

      const renderGraph = (data, keyName, type) => {
        const chartHelper = GoogleCharts.api.visualization;
        const chartData = chartHelper.arrayToDataTable(data);
        chartData.sort([{ column: 1, asc: true }]);

        const divToRenderChart = document.getElementById('chart');

        const chart = type === 'pie' ? new chartHelper.PieChart(divToRenderChart) :
          new chartHelper.ColumnChart(divToRenderChart);

        chart.draw(chartData, {
          title: `${mapKeyNameToWords(keyName)}`,
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

      const toggleKey = (key) => activeTableKeys.value[key]
        ? activeTableKeys.value[key].delete
        : activeTableKeys.value[key] = true;

      watch(selectedGraphKey, () => generateGraph(selectedGraphKey.value));

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

        renderableResults.value = intermediateResults;

        if (displayChart.value) generateGraph(selectedGraphKey.value);
      });

      watch([queryInput, selectedOperator, queryOperand], () => canSubmitFilter.value =
        (queryInput.value !== '' && selectedOperator.value !== 'Please select' && queryOperand.value !== '')
      );

      watch(selectedGeneMutation, () => {
        filters = [];
        renderableResults.value = allDocuments
          .filter(doc => doc[`${selectedGeneMutation.value}`]);
      });

      return { activeTableKeys, addFilter, canSubmitFilter, deleteFilter, displayChart, filters, fireStoreOperators,
               geneMutations, generateGraph, isFetchingData, isLoadingGraph, mapKeyNameToWords, optionalTableKeys,
               queryInput, queryOperand, renderableResults, selectedGeneMutation, selectGraphKey, selectedOperator,
               toggleKey, useAdvancedMode };
    }
  };
</script>

<style lang="scss" scoped module>
  @import './Query.module.scss';
</style>
