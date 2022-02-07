<template>
  <PageWrapper>
    <div>
      <li v-for="item in data" :key="item.message">
        {{item.id}} {{ item.data }}
      </li>
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
    async mounted() {
      const results = await generateQuery([
        {
          fieldPath: 'MYH7',
          opStr: '==',
          value: true
        },
        {
          fieldPath: 'scar5',
          opStr: '==',
          value: true
        }
      ]);
      results.forEach((result) => this.data.push(result));
    }
  };
</script>
