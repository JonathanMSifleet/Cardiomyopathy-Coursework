<template>
  <PageWrapper>
    <h1 :class="[$style.Heading]">Statistics</h1>

    <div id="v-model-select" :class="[$style.SelectWrapper]">
      <select v-model="selectedGeneMutation" :class="[$style.Select]">
        <option v-for="geneMutation in geneMutations"
                :disabled="geneMutation === 'Please select' ? true : false"
                :key="geneMutation"
        >
          {{geneMutation}}
        </option>
      </select>
    </div>

    <MDBBtn @click="getGeneMutationData" color="success" :class="[$style.FetchDataButton]">
      Get data
    </MDBBtn>

    <div id="chart" />

    <MDBRow :class="[$style.KeyColumnRow]">
      <p>Click a key to view a graph on it </p>
      <MDBCol md="3" v-for="index in chunkedKeys.length" :key="index">
        <li v-for="key in chunkedKeys[index-1]" :key="key"
            @click="generateGraph(key)"
            :class="[$style.Key]"
        >
          {{key}}
        </li>
      </MDBCol>
    </MDBRow>
    <div>

    </div>
  </PageWrapper>
</template>

<script>
  import PageWrapper from '../../components/PageWrapper/PageWrapper.vue';
  import generateQuery from '../../utils/generateQuery';
  import mapGeneName from '../../utils/mapGeneMutationNameToDBColumnName';
  import {  MDBBtn, MDBCol, MDBRow } from 'mdb-vue-ui-kit';
  import { reactive, ref } from 'vue';
  import chunk from 'chunk';
  import { GoogleCharts } from 'google-charts';


  export default {
    name: 'Home',
    components: {
      MDBBtn, MDBCol, MDBRow, PageWrapper
    },
    setup() {
      const chunkedKeys = reactive([]);
      const geneMutations = reactive(['Please select',
                                      'ACTC',
                                      'MYBPC3',
                                      'MYH7',
                                      'MYL2',
                                      'TNNI3',
                                      'TNNT2',
                                      'TPM1',
                                      'TTN']);
      const keys = reactive([]);
      const queryConstraints = [];
      const queryResults = reactive([]);
      let selectedGeneMutation = ref('Please select');

      const getGeneMutationData = async () => {
        // cleanup();

        queryConstraints.push({
          fieldPath: mapGeneName(selectedGeneMutation.value),
          opStr: '==',
          value: true
        });

        const result = await generateQuery(queryConstraints);
        result.forEach((result) => queryResults.push(result));
        keys.push(...determineKeys(queryResults));

        // groups array of keys into smaller keys to be rendered in columns
        chunkedKeys.push(...chunk(keys, Math.ceil(keys.length/4)));
      };

      const determineKeys = (data) => {
        const localKeys = [];
        data.forEach((curDoc) => Object.keys(curDoc.data).forEach((key) => localKeys.push(key)));

        // remove duplicate keys and insensitive sort:
        return [...new Set(localKeys)].sort(Intl.Collator().compare);
      };

      const cleanup = () => {
        chunkedKeys.length  = 0;
        keys.length = 0;
        queryConstraints.length = 0;
        queryResults.length = 0;
      };

      const generateGraph = async (keyName) => {
        const quantity = {true: 0, false: 0};

        queryResults.forEach((doc) => {
          const keyValue = doc.data[keyName];

          switch (typeof keyValue) {
          case 'boolean':
            quantity[`${keyValue}`] = ++quantity[`${keyValue}`];
            break;
          case 'number':
            // to do
            break;
          }

        });

        const chartData =  Object.entries(quantity);
        chartData.unshift(['Chart thing', 'Chart amount']);

        GoogleCharts.load(() => {
          const data = GoogleCharts.api.visualization.arrayToDataTable(chartData);
          const chart = new GoogleCharts.api.visualization.PieChart(document.getElementById('chart'));
          chart.draw(data);
        });
      };

      return { chunkedKeys, generateGraph, getGeneMutationData, geneMutations,
               keys, queryResults, selectedGeneMutation };
    }
  };
</script>

<style lang="scss" module scoped>
  @import './Query.module.scss';
</style>
