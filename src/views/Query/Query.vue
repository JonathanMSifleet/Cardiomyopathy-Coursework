<template>
  <!-- To do:
    - Validate user input
    - Display message on invalid filter
  -->
  <PageWrapper>
    <h1 :class="[$style.Heading]">
      Gene mutation data
    </h1>

    <Spinner v-if="isLoading === true" />
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
            {{ filter.fieldPath }} {{ filter.opStr }} {{ filter.value }} x
          </li>
        </ul>
      </div>

      <p>Please add a filter:</p>

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
          <select v-model="selectedOperator" :class="[$style.Select]">
            <option
              v-for="operation in Object.entries(fireStoreOperators)"
              :key="operation"
              :disabled="operation === 'Please select' ? true : false"
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
          color="success"
          @click="addFilter"
        >
          Add filter
        </MDBBtn>
      </div>

      <div :class="[$style.CheckboxWrapper]">
        <p>Selected columns:</p>
        <p>
          Click a table header to view a graph on the data
        </p>
        <MDBCheckbox
          v-for="(key, index) in Object.keys(optionalTableKeys).sort()"
          :key="index"
          v-model="activeTableKeys[key]"
          :label="key"
          inline
          @change="toggleKey(key)"
        />
      </div>

      <div :class="[$style.TableWrapper]">
        <p>Results:</p>

        <div :class="[$style.ChartWrapper]">
          <div id="chart" :class="[$style.Chart]" />
        </div>

        <MDBTable
          bordered
          striped
          responsive
        >
          <thead>
            <tr>
              <th
                v-for="(key, index) in Object.entries(activeTableKeys)"
                :key="index"
                scope="col"
                @click="generateGraph(key[0])"
              >
                <b>{{ key[0] }}</b>
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
    </div>
  </PageWrapper>
</template>

<script>
  import PageWrapper from '../../components/PageWrapper/PageWrapper.vue';
  import Spinner from '../../components/Spinner/Spinner';
  import determineKeys from '../../utils/determineKeys';
  import fetchData from '../../utils/fetchData';
  import { GoogleCharts } from 'google-charts';
  import { MDBBtn, MDBCheckbox, MDBInput, MDBTable } from 'mdb-vue-ui-kit';
  import { reactive, ref, render, watch } from 'vue';

  export default {
    name: 'Query',
    components: {
      MDBBtn, MDBCheckbox, MDBInput, MDBTable, PageWrapper, Spinner
    },
    setup() {
      const allDocuments = []; // do not edit the value of this variable
      let displayChart = ref(false);
      const fireStoreOperators = {
        '<': 'less than',
        '<=': 'less than or equal to',
        '==': 'equal to',
        '>': 'greater than',
        '>=': 'greater than or equal to',
        '!=': 'not equal to'
      };
      let filters = reactive([]);
      let isLoading = ref(false);
      let optionalTableKeys = ref([]);
      let queryInput = ref();
      let queryOperand = ref();
      let renderableResults = ref([]);
      let selectedOperator = ref();
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
        'female': true,
        'male': true,
        'AgeatMRI': true,
        'ApicalHCM': true,
        'SuddenCardiacDeath': true,
        'Hypertension': true,
        'Diabetes': true,
        'Myectomy': true
      });

      (async () => {
        isLoading.value = true;

        const results = await fetchData();
        results.forEach(doc => allDocuments.push(doc));
        renderableResults.value = allDocuments;

        optionalTableKeys.value = determineKeys(allDocuments);

        isLoading.value = false;
      })();

      const addFilter = () => filters.push({
        fieldPath: queryInput.value,
        opStr: Object.keys(fireStoreOperators).find(key => fireStoreOperators[key] === selectedOperator.value),
        value: convertValueToType(queryOperand.value)
      });

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

      const toggleKey = (key) => activeTableKeys.value[key]
        ? activeTableKeys.value[key].delete
        : activeTableKeys.value[key] = true;

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

      const generateGraph = async (keyName) => {
        const { data, type } = extractDataFromResults(keyName);
        data.unshift(['Test', 'Value']);

        data.forEach((curData) => curData[0] = curData[0][0].toUpperCase()
          + curData[0].slice(1).toLowerCase()
        );

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
          title: `${keyName}`,
          is3D: true,
          vAxis: {
            title: 'Value'
          },
          hAxis: {
            title: 'Record from database'
          }
        });
        displayChart.value = true;
      };

      watch(filters, async () => {
        let intermediateResults = allDocuments;
        filters.forEach(filter => {
          intermediateResults = intermediateResults.filter(doc => {
            const value = doc[filter.fieldPath];
            const operator = filter.opStr;

            switch (operator) {
            case '<':
              return value < filter.value;
            case '<=':
              return value <= filter.value;
            case '==':
              return value === filter.value;
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
      });

      return { activeTableKeys, addFilter, deleteFilter, displayChart, filters, fireStoreOperators,
               generateGraph, isLoading, optionalTableKeys, queryInput, queryOperand, renderableResults,
               selectedOperator, toggleKey };
    }
  };
</script>

<style lang="scss" scoped module>
  @import './Query.module.scss';
</style>
