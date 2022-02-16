<template>
  <div :class="[$style.ComponentWrapper]">
    <div id="v-model-select" :class="[$style.SelectWrapper]">
      <select v-model="selectedGeneMutation" :class="[$style.Select]">
        <option
          v-for="(geneMutation, index) in geneMutations"
          :key="index"
          :disabled="geneMutation === 'Please select' ? true : false"
        >
          {{ geneMutation }}
        </option>
      </select>
    </div>

    <div :class="[$style.FetchDataWrapper]">
      <MDBBtn
        color="success"
        :class="[$style.FetchDataButton]"
        @click="getGeneMutationData"
      >
        Get data
      </MDBBtn>

      <div v-show="displayChart" :class="[$style.ChartWrapper]">
        <p>{{ queryResults.length }} records were found with this attribute:  </p>
        <div id="chart" :class="[$style.Chart]" />
      </div>
    </div>

    <MDBRow v-if="hasFetchedKeys" :class="[$style.KeyColumnRow]">
      <p>All associated attributes with gene mutation {{ selectedGeneMutation }}.</p>
      <p>Please click an attribute to view its data:</p>

      <MDBCol v-for="index in chunkedKeys.length" :key="index" md="3">
        <ul>
          <li
            v-for="key in chunkedKeys[--index]"
            :key="key"
            :class="[$style.Key]"
            @click="generateGraph(key)"
          >
            {{ key }}
          </li>
        </ul>
      </MDBCol>
    </MDBRow>
  </div>
</template>

<script>
  import generateQuery from '../../../utils/generateQuery';
  import mapGeneName from '../../../utils/mapGeneMutationNameToDBColumnName';
  import { reactive, ref, watch } from 'vue';
  import chunk from 'chunk';
  import { GoogleCharts } from 'google-charts';
  import { MDBBtn, MDBCol, MDBRow } from 'mdb-vue-ui-kit';
  import determineKeys from '../../../utils/determineKeys';

  export default {
    name: 'SimpleSearch',
    components: {
      MDBBtn, MDBCol, MDBRow
    },
    setup() {
      const chunkedKeys = [];
      let displayChart = ref(false);
      const geneMutations = ['Please select',
                             'ACTC',
                             'MYBPC3',
                             'MYH7',
                             'MYL2',
                             'TNNI3',
                             'TNNT2',
                             'TPM1',
                             'TTN'];
      let hasFetchedKeys = ref(false);
      const keys = [];
      let numObjectsQueried;
      const queryResults = reactive([]);
      let selectedGeneMutation = ref('Please select');

      watch([selectedGeneMutation], () => {
        chunkedKeys.length  = 0;
        displayChart.value = false;
        hasFetchedKeys.value = false;
        keys.length = 0;
        queryResults.length = 0;
      });

      const getGeneMutationData = async () => {
        const result = await generateQuery([{
          fieldPath: mapGeneName(selectedGeneMutation.value),
          opStr: '==',
          value: true
        }]);
        numObjectsQueried = result.length;

        result.forEach((result) => queryResults.push(result));
        keys.push(...determineKeys(queryResults));

        // groups array of keys into smaller keys to be rendered in columns
        chunkedKeys.push(...chunk(keys, Math.ceil(keys.length/4)));

        hasFetchedKeys.value = true;
      };

      const extractDataFromResults = (keyName) => {
        let data = {};
        let type;

        let counter = 0;
        queryResults.forEach((doc) => {
          const keyValue = doc.data[keyName];

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

      const generateGraph = async (keyName) => {
        const { data, type } = extractDataFromResults(keyName);
        data.unshift(['Test', 'Value']);

        data.forEach((curData) => curData[0] = curData[0][0].toUpperCase()
          + curData[0].slice(1).toLowerCase()
        );

        GoogleCharts.load(() => renderGraph(data, keyName, type));
      };

      return { chunkedKeys, displayChart, generateGraph, getGeneMutationData, geneMutations,
               hasFetchedKeys, keys, numObjectsQueried, queryResults, selectedGeneMutation };
    }
  };
</script>

<style lang="scss" scoped module>
  @import './SimpleSearch.module.scss';
</style>
