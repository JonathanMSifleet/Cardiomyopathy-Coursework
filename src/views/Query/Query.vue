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

      <div v-else :class="$style.ComponentWrapper">
        <p :class="$style.GeneMutationSelection">
          Select a gene mutation:
        </p>
        <div :class="[$style.SelectWrapper]">
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
        <GeneModal :selectedGene="selectedGeneMutation" />
      </div>

      <div :class="$style.CheckboxWrapper">
        <p>Selected columns:</p>
        <MDBCheckbox
          v-for="(key, index) in mapKeyToWords(Object.keys(optionalTableHeaders)).sort(Intl.Collator().compare)"
          :key="index"
          v-model="activeCheckboxes[key]"
          :label="mapKeyToWords(key)"
          inline
          @change="toggleHeader(key)"
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
                v-for="header in activeTableHeaders"
                :key="header"
                scope="col"
                :class="$style.TableHeaderCell"
                @click="selectGraphKey(header)"
              >
                <p :class="$style.TableHeaderText">
                  {{ mapKeyToWords(header) }}
                  {{ header[0] !== mapKeyToWords(header)
                    ? `(${header})`
                    : null
                  }}
                </p>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(dataItem, outerIndex) in renderableResults" :key="outerIndex">
              <td v-for="(key, innerIndex) in activeTableHeaders" :key="innerIndex">
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
  import GeneModal from '../../components/GeneModal/GeneModal.vue';
  import PageWrapper from '../../components/PageWrapper/PageWrapper.vue';
  import Spinner from '../../components/Spinner/Spinner.vue';
  import determineKeys from '../../utils/determineKeys';
  import fetchDocuments from '../../utils/fetchDocuments';
  import getUser from '../../composables/getUser';
  import generateGraph from '../../utils/generateGraph';
  import mapKeyToWords from '../../utils/mapKeyToWords';
  import { MDBBtn, MDBCheckbox, MDBInput, MDBSwitch, MDBTable } from 'mdb-vue-ui-kit';
  import { operandIsValid } from '../../utils/validationFunctions';
  import { reactive, ref, watch, watchEffect } from 'vue';
  import { useRouter } from 'vue-router';

  export default {
    name: 'Query',
    components: {
      MDBBtn, MDBCheckbox, MDBInput, MDBSwitch, MDBTable, PageWrapper, Spinner, GeneModal
    },
    setup() {
      let activeCheckboxes = ref({});
      const activeTableHeaders = ref([
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
      let optionalTableHeaders = ref([]);
      const pageSize = 15;
      let queryInput = ref('');
      let queryOperand = ref('');
      let renderableResults = ref([]);
      const router = useRouter();
      let selectedGeneMutation = ref('Please select');
      let selectedGraphKey = ref();
      let selectedOperator = ref('Please select');
      let selectedTablePage = ref(1);
      let useAdvancedMode = ref(false);

      (async () => {
        isFetchingData.value = true;

        try {
          allDocuments = await fetchDocuments();
          if (allDocuments.length === 0) throw new Error('No docs');

          cleanup();

          optionalTableHeaders.value = determineKeys(allDocuments);
          delete optionalTableHeaders.value.userId;
          delete optionalTableHeaders.value.createdAt;
          delete optionalTableHeaders.value.deletedAt;

          activeTableHeaders.value.forEach(key => activeCheckboxes.value[key] = true);
        } catch (error) {
          switch(true) {
          case error.message.includes('Network Error'):
            errorMessage.value = 'Firebase details are setup incorrectly';
            break;
          case error.message.includes('multi-tab'):
            errorMessage.value = 'Only one tab can be open at a time in development mode due to Firebase persistence';
            break;
          case error.message.includes('No docs'):
            errorMessage.value = 'No documents were found in the database';
            break;
          default:
            console.error(error);
            errorMessage.value = error.message;
          }
        } finally {
          isFetchingData.value = false;
        }
      })();

      const addFilter = () => {
        if (optionalTableHeaders.value[queryInput.value] === undefined) {
          alert('Attribute not found in database'); return;
        }

        const operandValidationMessage = operandIsValid(queryOperand.value);
        if (!operandValidationMessage) {
          alert('Input must be a number or equal to true or false'); return;
        }

        filters.push({
          fieldPath: queryInput.value,
          opStr: Object.keys(fireStoreOperators).find(key => fireStoreOperators[key] === selectedOperator.value),
          value: convertValueToType(queryOperand.value)
        });
      };

      const cleanup = () => {
        filteredResults.value = allDocuments;
        selectedTablePage.value = 1;
        renderableResults.value = resetTablePage(filteredResults.value);
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

      const resetTablePage = (array) => {
        return array.slice(0, pageSize);
      };

      const selectGraphKey = (key) => selectedGraphKey.value = key;

      const toggleHeader = (key) => {
        if (activeTableHeaders.value.includes(key)) {
          activeTableHeaders.value.splice(activeTableHeaders.value.indexOf(key), 1);
          delete activeCheckboxes[key];
        } else {
          activeTableHeaders.value.push(key);
          activeCheckboxes[key] = true;
        }
      };

      watch(filters, () => {
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
        selectedTablePage.value = 1;
        renderableResults.value = resetTablePage(filteredResults.value);

        if (displayChart.value)
          generateGraph(displayChart.value, 'chart', isLoadingGraph.value,
                        selectedGraphKey.value, null, filteredResults.value, false);
      });

      watch([queryInput, selectedOperator, queryOperand], () => canSubmitFilter.value =
        (queryInput.value !== '' && selectedOperator.value !== 'Please select' && queryOperand.value !== '')
      );

      watch(selectedGeneMutation, () => {
        filters = [];
        filteredResults.value = allDocuments
          .filter(doc => doc[selectedGeneMutation.value]);

        cleanup();
      });

      watch(selectedGraphKey, () =>
        generateGraph(displayChart.value, 'chart', isLoadingGraph.value,
                      selectedGraphKey.value, null, filteredResults.value, false));

      // paginate table:
      watch(selectedTablePage, () => {
        const startIndex = (selectedTablePage.value - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        renderableResults.value = filteredResults.value.slice(startIndex, endIndex);
      });

      watch(useAdvancedMode, () => cleanup());

      const { currentUser } = getUser();

      watchEffect(() => {
        if (!currentUser.value) router.push('/login');
      });

      return { activeCheckboxes, activeTableHeaders, addFilter, canSubmitFilter, deleteFilter, displayChart,
               errorMessage, filters, filteredResults, fireStoreOperators, geneMutations, generateGraph, isFetchingData,
               isLoadingGraph, mapKeyToWords, optionalTableHeaders, pageSize, queryInput, queryOperand,
               renderableResults, selectedGeneMutation, selectGraphKey, selectedOperator, selectedTablePage,
               toggleHeader, useAdvancedMode };
    }
  };
</script>

<style lang="scss" scoped module>
  @import './Query.module.scss';
</style>
