<template>
  <PageWrapper>
    <ExperimentalData />
  </PageWrapper>
</template>

<script>
  import PageWrapper from '../../components/PageWrapper/PageWrapper.vue';
  import ExperimentalData from '../../components/ExperimentalData/ExperimentalData.vue';

  export default {
    name: 'Home',
    components: {
      PageWrapper,
      ExperimentalData
    },
    setup() {
    }
  };
</script>
