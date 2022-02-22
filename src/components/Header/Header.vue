<template>
  <header>
    <MDBNavbar :class="[$style.Header, 'header']" expand="lg" light container>
      <MDBNavbarToggler target="#navbarExample01" />
      <MDBNavbarNav collapse="navbarExample01" class="mb-2 mb-lg-0">
        <MDBNavbarItem :to="{ name: 'Home' }" active> Home </MDBNavbarItem>
        <MDBNavbarItem v-if="!user" :to="{ name: 'Login' }" > Login </MDBNavbarItem>
        <MDBNavbarItem v-if="user" @click="logout"> Logout </MDBNavbarItem>
      </MDBNavbarNav>
    </MDBNavbar>
  </header>
</template>

<script>
  import { MDBNavbar, MDBNavbarToggler, MDBNavbarNav, MDBNavbarItem } from 'mdb-vue-ui-kit';
  import { useRouter } from 'vue-router';
  import { getAuth, signOut }  from 'firebase/auth';

  export default {
    components: {
      MDBNavbar,
      MDBNavbarToggler,
      MDBNavbarNav,
      MDBNavbarItem
    },
    setup () {
      const router = useRouter();
      const auth = getAuth();
      //nav bar logout
      const logout = () => {
        signOut(auth)
          .then(() => console.log('Signed out'))
          .then(() => router.push('/'))
          .catch((err) => alert(err.message));
      };
      return {logout};
    },
    computed: {
      user() {
        return this.$store.state.user //checks if user exists in store and returns boolean
      }
    }
  };
</script>

<style lang="scss" module scoped>
@import "./Header.module.scss";
</style>
