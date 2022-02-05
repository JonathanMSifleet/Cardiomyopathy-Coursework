<template>
  <PageWrapper>
    <HelloWorld msg="Welcome to My Vue.js App" />
  </PageWrapper>
</template>

<script>
  import HelloWorld from '../../components/HelloWorld/HelloWorld.vue';
  import PageWrapper from '../../hoc/PageWrapper/PageWrapper.vue';

  export default {
    name: 'Home',
    components: {
      HelloWorld, PageWrapper
    }
  };
</script>
