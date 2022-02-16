<template>
  <!-- To do:
    - Validate user input
    - Display message on invalid filter
  -->
  <PageWrapper>
    <div v-show="displayChart" id="chart" />
    <h1 :class="[$style.Heading]">
      Gene mutation data
    </h1>
    <div :class="[$style.ComponentWrapper]">
      <div v-if="filters.length !== 0" :class="[$style.FiltersWrapper]">
        <p> Filters: </p>
        <ul>
          <li
            v-for="(filter, index) in filters"
            :key="index"
            :class="[$style.Filter]"
          >
            {{ filter.fieldPath }} {{ filter.opStr }} {{ filter.value }}
            <img src="../../assets/svg/Cross.svg" :class="[$style.DeleteFilter]" @click="deleteFilter(index)">
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
        <Spinner v-if="isLoading === true" />
        <MDBCheckbox
          v-for="(key, index) in Object.keys(optionalTableKeys).sort()"
          v-else
          :key="index"
          v-model="activeTableKeys[key]"
          :label="key"
          inline
          @change="toggleKey(key)"
        />
      </div>

      <div :class="[$style.TableWrapper]">
        <p>Results:</p>
        <Spinner v-if="isLoading === true" />
        <MDBTable
          v-else
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
            <tr v-for="(dataItem, outerIndex) in queryResults" :key="outerIndex">
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
  import generateQuery from '../../utils/generateQuery';
  import store from '../../services/store';
  import { GoogleCharts } from 'google-charts';
  import { MDBBtn, MDBCheckbox, MDBInput, MDBTable } from 'mdb-vue-ui-kit';
  import { collection, getDocs } from 'firebase/firestore';
  import { reactive, ref, watch } from 'vue';

  export default {
    name: 'Query',
    components: {
      MDBBtn, MDBCheckbox, MDBInput, MDBTable, PageWrapper, Spinner
    },
    setup() {
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
      let queryResults = ref([]);
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

        const results = await getDocs(collection(await store.database, 'hcmData'));
        results.forEach(doc => queryResults.value.push(doc.data()));

        optionalTableKeys.value = determineKeys(queryResults.value);

        isLoading.value = false;
      })();

      const cleanup = () => {
        queryResults.value = [];
      };

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
        queryResults.value.forEach((doc) => {
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
        cleanup();

        console.log('filters', filters);

        queryResults.value = await generateQuery(filters);
      });

      watch(optionalTableKeys, async () => {
        console.log('🚀 ~ file: AdvancedSearch.vue ~ line 198 ~ watch ~ optionalTableKeys', optionalTableKeys.value);
      });

      return { activeTableKeys, addFilter, deleteFilter, displayChart, filters, fireStoreOperators,
               generateGraph, isLoading, optionalTableKeys, queryInput, queryOperand, queryResults,
               selectedOperator, toggleKey };
    }
  };
</script>

<style lang="scss" scoped module>
  @import './Query.module.scss';
</style>
