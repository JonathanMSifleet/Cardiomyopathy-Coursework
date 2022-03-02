<template>
  <PageWrapper>
    <HelpComponent v-for="(post, index) in HCM" :key="index" :post="post" />
  </PageWrapper>
</template>

<script>
  import PageWrapper from '../../components/PageWrapper/PageWrapper.vue';
  import HelpComponent from '../../components/Help/HelpComponent.vue';

  export default {
    name: 'Help',
    components: {
      PageWrapper,
      HelpComponent
    },
    setup() {
      return {
        HCM: [
          {
            title: 'Query',
            description: 'query is',
            photo: 'hcm'
          },
          {
            title: 'help 2',
            description: 'help 2',
            photo: 'query-page'
          }
        ]
      };
    }
  };
</script>
