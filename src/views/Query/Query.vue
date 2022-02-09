<template>
  <PageWrapper>
    <div id="v-model-select" :class="[$style.SelectWrapper]">
      <select v-model="selectedGeneMutation" :class="[$style.Select]">
        <option v-for="geneMutation in geneMutations" :key="geneMutation">{{geneMutation}}</option>
      </select>
    </div>

    <MDBBtn @click="getGeneMutationData" color="success" :class="[$style.FetchDataButton]">
      Get data
    </MDBBtn>

    <div>
      <li v-for="item in results" :key="item.message">
        {{item.id}} {{ item.data }}
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
      const geneMutations = reactive(['ACTC',
                                      'MYBPC3',
                                      'MYH7',
                                      'MYL2',
                                      'TNNI3',
                                      'TNNT2',
                                      'TPM1',
                                      'TTN']);
      const queryConstraints = [];
      let selectedGeneMutation = ref('');
      const results = reactive([]);

      const getGeneMutationData = async () => {
        queryConstraints.push({
          fieldPath: mapGeneName(selectedGeneMutation.value),
          opStr: '==',
          value: true
        });

        const queryResults = await generateQuery(queryConstraints);
        queryResults.forEach((result) => results.push(result));
      };

      return { getGeneMutationData, geneMutations, results, selectedGeneMutation };
    }
  };
</script>

<style lang="scss" module scoped>
  @import './Query.module.scss';
</style>
