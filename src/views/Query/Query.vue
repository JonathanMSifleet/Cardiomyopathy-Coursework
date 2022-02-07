<template>
  <PageWrapper>
    <div>
      <button @click="getResults()"> Click </button>
      <br />
      {{ data }}
    </div>
  </PageWrapper>
</template>

<script>
  import PageWrapper from '../../components/PageWrapper/PageWrapper.vue';
  import generateQuery from '../../functions/generateQuery';

  export default {
    name: 'Home',
    components: {
      PageWrapper
    },
    data() {
      return {
        data: []
      };
    },
    setup() {},
    methods: {
      async getResults() {
        const results = await generateQuery();

        results.forEach((result) => this.data.push(result));

        console.log('data', this.data);
      }
    }
  };
</script>
