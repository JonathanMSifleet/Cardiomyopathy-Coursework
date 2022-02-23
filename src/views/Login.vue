<template>
  <PageWrapper>
    <login-component />
  </PageWrapper>

</template>

<script>
  import PageWrapper from '../components/PageWrapper/PageWrapper.vue';
  import LoginComponent from '../components/LoginComponent.vue';

  export default {
    components: { LoginComponent, PageWrapper }
  };
</script>

<style></style>
