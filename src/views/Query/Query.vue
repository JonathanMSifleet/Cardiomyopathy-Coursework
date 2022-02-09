<template>
  <PageWrapper>
    <div id="v-model-select" :class="[$style.SelectWrapper]">
      <select v-model="selectedGeneMutation" :class="[$style.Select]">
        <option v-for="geneMutation in geneMutations" :key="geneMutation">{{geneMutation}}</option>
      </select>
    </div>

    <MDBBtn @click="getGeneMutationData" color="success">Get results</MDBBtn>

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
  import { MDBBtn } from 'mdb-vue-ui-kit';

  export default {
    name: 'Home',
    components: {
      MDBBtn, PageWrapper
    },
    data: () => ({
      geneMutations: ['ACTC',
                      'MYBPC3',
                      'MYH7',
                      'MYL2',
                      'TNNI3',
                      'TNNT2',
                      'TPM1',
                      'TTN'],
      queryConstraints: [],
      results: [],
      selectedGeneMutation: ''
    }),
    setup() {},
    methods: {
      getGeneMutationData: () => {
        this.queryConstraints.push({
          fieldPath: this.selectedGeneMutation,
          opStr: '==',
          value: true
        });

        console.log(this.queryConstraints);

        generateQuery(this.queryConstraints).then(results => {
          results.forEach((result) => this.results.push(result));
        });
      }
    }
  };
</script>

<style lang="scss" module scoped>
  @import './Query.module.scss';
</style>
