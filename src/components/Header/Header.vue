<template>
  <header>
    <MDBNavbar :class="[$style.Header, 'header']" expand="lg" light bg="success" container>
      <MDBNavbarToggler target="#navbarExample01"/>
      <MDBNavbarNav collapse="navbarExample01" class="mb-2 mb-lg-0">
        <MDBNavbarItem href="/" active>
          Home
        </MDBNavbarItem>
        <MDBNavbarItem href="/about">
          About
        </MDBNavbarItem>
      </MDBNavbarNav>
    </MDBNavbar>
  </header>
</template>

<script>
  import { MDBNavbar, MDBNavbarToggler, MDBNavbarNav, MDBNavbarItem } from 'mdb-vue-ui-kit';

  export default {
    components: {
      MDBNavbar,
      MDBNavbarToggler,
      MDBNavbarNav,
      MDBNavbarItem
    }
  };
</script>

<style lang="scss" module scoped>
  @import './Header.module.scss';
</style>
