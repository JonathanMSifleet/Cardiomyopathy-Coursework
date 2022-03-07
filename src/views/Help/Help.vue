<template>
  <PageWrapper>
    <HelpComponent v-for="(post, index) in HCM" :key="index" :post="post" />
  </PageWrapper>
</template>

<script>
  import PageWrapper from '../../components/PageWrapper/PageWrapper.vue';
  import HelpComponent from '../../components/Help/Help.vue';

  export default {
    name: 'Help',
    components: { HelpComponent, PageWrapper },
    setup() {
      return {
        HCM: [
          {
            title: 'Query',
            description: 'query is',
            photo: 'query-page',
            link: 'Query'
          },
          {
            title: 'Experimental Data',
            description: 'Experimental data is',
            photo: 'experimental-data',
            link: 'ExperimentalData'
          }
        ]
      };
    }
  };
</script>
