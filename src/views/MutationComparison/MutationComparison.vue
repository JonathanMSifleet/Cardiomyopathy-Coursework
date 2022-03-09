<template>
  <PageWrapper>
    <h1 :class="$style.Heading">
      Comparison of Gene Mutation data
    </h1>

    <div :class="[$style.CompareSingleGeneWrapper, 'mt-4', 'me-4']">
      <MDBSwitch
        v-model="compareSingleGene"
        label="Compare single gene's data"
      />
    </div>

    <div v-if="compareSingleGene" />

    <div v-else>
      <p :class="$style.GeneSelectionInstructionText">
        Please select two gene mutations in order to compare them:
      </p>

      <div :class="$style.OuterSelectWrapper">
        <div :class="$style.SelectWrapper">
          <p> Gene mutation one: </p>
          <select v-model="selectedGeneMutationOne" :class="'form-select'">
            <option
              v-for="(geneMutation, index) in availableMutationsOne"
              :key="index"
              :disabled="geneMutation === 'Please select'"
            >
              {{ geneMutation }}
            </option>
          </select>
        </div>

        <div :class="$style.SelectWrapper">
          <p> Gene mutation two: </p>
          <select v-model="selectedGeneMutationTwo" :class="'form-select'">
            <option
              v-for="(geneMutation, index) in availableMutationsTwo"
              :key="index"
              :disabled="geneMutation === 'Please select'"
            >
              {{ geneMutation }}
            </option>
          </select>
        </div>
      </div>

      <div :class="$style.GraphAndKeyWrapper">
        <Spinner v-if="isLoadingGraphs" />

        <div :class="$style.ChartWrapper">
          <div id="graphOne" :class="$style.Chart" />
          <div id="graphTwo" :class="$style.Chart" />
        </div>

        <div :class="$style.KeyWrapper">
          <MDBRow v-if="selectedGeneMutationOne !== 'Please select' && selectedGeneMutationTwo !== 'Please select'">
            <p :class="$style.ClickKeyInstructionText">
              Please click a item from the list to view the data of both mutations:
            </p>

            <MDBCol v-for="index in chunkedKeys.length" :key="index" md="3">
              <ul>
                <li
                  v-for="key in chunkedKeys[--index]"
                  :key="key"
                  :class="$style.Key"
                  @click="selectedKey = key"
                >
                  {{ key }}
                </li>
              </ul>
            </MDBCol>
          </MDBRow>
        </div>
      </div>
    </div>
  </PageWrapper>
</template>

<script>
  import PageWrapper from '../../components/PageWrapper/PageWrapper.vue';
  import Spinner from '../../components/Spinner/Spinner.vue';
  import chunk from 'chunk';
  import determineKeys from '../../utils/determineKeys';
  import fetchDocuments from '../../utils/fetchDocuments';
  import generateGraph from '../../utils/generateGraph';
  import mapKeyToWords from '../../utils/mapKeyToWords';
  import { MDBCol, MDBRow, MDBSwitch } from 'mdb-vue-ui-kit';
  import { ref, watch } from 'vue';

  export default {
    name: 'MutationComparison',
    components: { MDBCol, MDBRow, MDBSwitch, PageWrapper, Spinner },
    setup() {
      const allDocuments = [];
      let availableMutationsOne = ref([]);
      let availableMutationsTwo = ref([]);
      let chunkedKeys = ref([]);
      let compareSingleGene = ref(false);
      let displayCharts = ref(false);
      const doughnutRef = ref();
      const geneMutations = [
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
      ];
      let isLoadingGraphs = ref(false);
      let mutationOneDocuments = [];
      let mutationTwoDocuments = [];
      let selectedGeneMutationOne = ref('Please select');
      let selectedGeneMutationTwo = ref('Please select');
      let selectedKey = ref('');
      let tableKeys = [];

      (async () => {
        const documents = await fetchDocuments();

        documents.forEach(doc => allDocuments.push(doc));

        geneMutations.forEach(geneMutation => {
          availableMutationsOne.value.push(geneMutation);
          availableMutationsTwo.value.push(geneMutation);
        });
      })();

      watch(selectedGeneMutationOne, () => {
        availableMutationsTwo.value = geneMutations;
        availableMutationsTwo.value = availableMutationsTwo.value.filter(mutation =>
          mutation !== selectedGeneMutationOne.value);
      });

      watch(selectedGeneMutationTwo, () => {
        availableMutationsOne.value = geneMutations;
        availableMutationsOne.value = availableMutationsOne.value.filter(mutation =>
          mutation !== selectedGeneMutationTwo.value);
      });

      watch(selectedGeneMutationOne, () => {
        mutationOneDocuments = allDocuments.filter(doc =>
          doc[selectedGeneMutationOne.value] === true);

        refreshKeys();
        if (selectedGeneMutationOne.value !== 'Please select' &&
          selectedGeneMutationTwo.value !== 'Please select' &&
          selectedKey.value !== '')
          generateGraph(displayCharts, 'graphOne', isLoadingGraphs.value, selectedKey.value,
                        mapKeyToWords(selectedGeneMutationOne.value), mutationOneDocuments, true);
      });

      watch(selectedGeneMutationTwo, () => {
        mutationTwoDocuments = allDocuments.filter(doc =>
          doc[selectedGeneMutationTwo.value] === true);

        refreshKeys();
        if (selectedGeneMutationOne.value !== 'Please select' &&
          selectedGeneMutationTwo.value !== 'Please select' &&
          selectedKey.value !== '')
          generateGraph(displayCharts, 'graphTwo', isLoadingGraphs.value, selectedKey.value,
                        mapKeyToWords(selectedGeneMutationTwo.value), mutationTwoDocuments, true);
      });

      const refreshKeys = () => {
        tableKeys = Object.keys(determineKeys([...mutationOneDocuments, ...mutationTwoDocuments]));
        // insensitive sort:
        tableKeys = tableKeys.sort(Intl.Collator().compare);

        chunkedKeys.value = chunk(tableKeys, Math.ceil(tableKeys.length / 4));
      };

      watch(selectedKey, () => {
        generateGraph(displayCharts, 'graphOne', isLoadingGraphs.value, selectedKey.value,
                      mapKeyToWords(selectedGeneMutationOne.value), mutationOneDocuments, true);
        generateGraph(displayCharts, 'graphTwo', isLoadingGraphs.value, selectedKey.value,
                      mapKeyToWords(selectedGeneMutationTwo.value), mutationTwoDocuments, true);
      });

      return { availableMutationsOne, availableMutationsTwo, chunkedKeys, compareSingleGene, doughnutRef,
               isLoadingGraphs, mapKeyToWords, selectedGeneMutationOne, selectedGeneMutationTwo, selectedKey };
    }
  };
</script>

<style scoped lang="scss" module>
  @import './MutationComparison.module.scss';
</style>
