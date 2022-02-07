<template>
  <PageWrapper> {{ homePage.title }} </PageWrapper>
</template>

<script>
  import PageWrapper from '../../components/PageWrapper/PageWrapper.vue';

  export default {
    name: 'Home',
    components: {
      PageWrapper
    },
    setup() {
      const homePage = { title: 'Welcome' };

      return { homePage };
    }
  };
</script>
