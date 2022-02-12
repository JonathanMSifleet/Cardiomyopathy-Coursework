<template>
  <MDBContainer fluid :class="[$style.PageWrapper]">
    <Header />
    <MDBRow :class="[$style.Row]">
      <MDBCol :class="[$style.SideColumn]" md="2"/>
      <MDBCol :class="[$style.MainContent]" md="8">
        <slot />
      </MDBCol>
      <MDBCol :class="[$style.SideColumn]" md="2"/>
    </MDBRow>
    <Footer />
  </MDBContainer>
</template>

<script>
  import { MDBContainer, MDBCol, MDBRow } from 'mdb-vue-ui-kit';
  import Footer from '../../components/Footer/Footer.vue';
  import Header from '../../components/Header/Header.vue';

  export default {
    components: {
      MDBContainer,
      MDBCol,
      MDBRow,
      Footer,
      Header
    }
  };
</script>

<style module lang="scss">
  @import './PageWrapper.module.scss';
</style>
