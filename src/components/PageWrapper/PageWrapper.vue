<template>
  <MDBContainer fluid :class="$style.PageWrapper">
    <Header />
    <MDBRow :class="$style.Row">
      <MDBCol :class="$style.SideColumnLeft" md="2" />
      <MDBCol :class="$style.MainContent" md="8">
        <slot />
      </MDBCol>
      <MDBCol :class="$style.SideColumnRight" md="2" />
    </MDBRow>
    <Footer />
  </MDBContainer>
</template>

<script>
  import Footer from '../../components/Footer/Footer.vue';
  import Header from '../../components/Header/Header.vue';
  import { MDBContainer, MDBCol, MDBRow } from 'mdb-vue-ui-kit';

  export default {
    components: {
      Footer,
      Header,
      MDBCol,
      MDBContainer,
      MDBRow
    }
  };
</script>

<style module lang="scss">
  @import './PageWrapper.module.scss';
</style>
