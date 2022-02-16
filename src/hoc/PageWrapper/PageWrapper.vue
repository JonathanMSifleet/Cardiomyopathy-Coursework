<template v-slot:childreb>
  <MDBContainer fluid :class="[$style.PageWrapper]">
    <div></div>
    <Header v-if="!navigation" :class="[$style.Header]" />
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
    },
    data(){
    return {
      navigation: null,
    }
    },
    created(){
      this.routeCheck();
    },
    methods: {
      routeCheck(){
        if (this.$route.name === "Login" || this.$route.name === "Register" || this.$route.name === "PasswordReset") {
          this.navigation = true;
          return;
        }
        this.navigation = false;;
      }
    },
    watch: {
      $route() {
        this.routeCheck();
      }
    }
  };
</script>

<style module lang="scss">
  @import './PageWrapper.module.scss';
</style>
