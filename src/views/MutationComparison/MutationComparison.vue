<template>
  <PageWrapper>
    <p> Please select two gene mutations in order to compare them: </p>
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

    <p> Please click a item from the list to view the data of both mutations: </p>

    <MDBRow>
      <p>Please click an attribute to view its data:</p>

      <MDBCol v-for="index in chunkedKeys.length" :key="index" md="3">
        <ul>
          <li
            v-for="key in chunkedKeys[--index]"
            :key="key"
            @click="generateGraph(key)"
          >
            {{ key }}
          </li>
        </ul>
      </MDBCol>
    </MDBRow>
  </PageWrapper>
</template>

<script>
  import PageWrapper from '../../components/PageWrapper/PageWrapper.vue';
  import chunk from 'chunk';
  import { ref, watch } from 'vue';
  import { MDBCol, MDBRow } from 'mdb-vue-ui-kit';
  import determineKeys from '../../utils/determineKeys';
  import fetchDocuments from '../../utils/fetchDocuments';

  export default {
    name: 'MutationComparison',
    components: { MDBCol, MDBRow, PageWrapper },
    setup() {
      const allDocuments = [];
      const availableMutationsOne = ref([]);
      const availableMutationsTwo = ref([]);
      const chunkedKeys = ref([]);
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
      let selectedGeneMutationOne = ref('Please select');
      let selectedGeneMutationTwo = ref('Please select');
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

      watch([selectedGeneMutationOne, selectedGeneMutationTwo], () => {
        const filteredDocuments = allDocuments.filter(doc => {
          return doc[selectedGeneMutationOne.value] === true || doc[selectedGeneMutationTwo.value] === true;
        });

        tableKeys = Object.keys(determineKeys(filteredDocuments));
        // insensitive sort:
        tableKeys = tableKeys.sort(Intl.Collator().compare);

        chunkedKeys.value = chunk(tableKeys, Math.ceil(tableKeys.length / 4));
      });

      return { availableMutationsOne, availableMutationsTwo, chunkedKeys,
               selectedGeneMutationOne, selectedGeneMutationTwo };
    }
  };
</script>
