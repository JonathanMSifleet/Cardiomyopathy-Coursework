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

    <div>
      <li v-for="key in keys" :key="key">
        {{key}}
      </li>
    </div>
  </PageWrapper>
</template>

<script>
  import PageWrapper from '../../components/PageWrapper/PageWrapper.vue';
  import generateQuery from '../../utils/generateQuery';
  import mapGeneName from '../../utils/mapGeneMutationNameToDBColumnName';
  import { MDBBtn } from 'mdb-vue-ui-kit';
  import { reactive, ref } from 'vue';

  export default {
    name: 'Home',
    components: {
      MDBBtn, PageWrapper
    },
    setup() {
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
      let selectedGeneMutation = ref('Please select');
      const queryResults = reactive([]);

      const getGeneMutationData = async () => {
        queryConstraints.push({
          fieldPath: mapGeneName(selectedGeneMutation.value),
          opStr: '==',
          value: true
        });

        const result = await generateQuery(queryConstraints);
        result.forEach((result) => queryResults.push(result));
        keys.push(...determineKeys(queryResults));
      };

      const determineKeys = (data) => {
        const localKeys = [];
        data.forEach((curDoc) => Object.keys(curDoc.data).forEach((key) => localKeys.push(key)));

        // remove duplicate keys:
        return [...new Set(localKeys)].sort();
      };

      return { getGeneMutationData, geneMutations, keys, queryResults, selectedGeneMutation };
    }
  };
</script>

<style lang="scss" module scoped>
  @import './Query.module.scss';
</style>
