<template>
  <header>
    <MDBNavbar :class="[$style.Header, 'header']" expand="lg" light container>
      <MDBNavbarToggler target="#navbarExample01" />
      <MDBNavbarNav collapse="navbarExample01" class="mb-2 mb-lg-0">
        <MDBNavbarItem :to="{ name: 'Home' }" active> Home </MDBNavbarItem>
        <MDBNavbarItem :to="{ name: 'About' }"> About </MDBNavbarItem>
      </MDBNavbarNav>
    </MDBNavbar>
  </header>
</template>

<script>
import { MDBNavbar, MDBNavbarToggler, MDBNavbarNav, MDBNavbarItem } from "mdb-vue-ui-kit";

export default {
  components: {
    MDBNavbar,
    MDBNavbarToggler,
    MDBNavbarNav,
    MDBNavbarItem,
  },
};
</script>

<style lang="scss" module scoped>
@import "./Header.module.scss";
</style>
