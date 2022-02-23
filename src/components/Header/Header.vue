<template>
  <header>
    <MDBNavbar
      :class="[$style.Header, 'header']"
      expand="lg"
      light
      bg="primary"
      container
      position="sticky"
    >
      <MDBNavbarToggler target="#navbarExample01" />
      <MDBNavbarNav collapse="navbarExample01" class="mb-2 mb-lg-0">
        <MDBNavbarItem :to="{ name: 'Home' }" active>
          Home
        </MDBNavbarItem>
        <MDBNavbarItem v-if="!currentUser" :to="{ name: 'Login' }" active>
          Login
        </MDBNavbarItem>
        <MDBNavbarItem :to="{ name: 'Query' }" active>
          Query
        </MDBNavbarItem>
      </MDBNavbarNav>
      <button v-if="currentUser" class="logout" @click="logout">
        Logout
      </button>
    </MDBNavbar>
  </header>
</template>

<script>
  import { MDBNavbar, MDBNavbarToggler, MDBNavbarNav, MDBNavbarItem } from 'mdb-vue-ui-kit';
  import { useRouter } from 'vue-router';
  import { getAuth, signOut }  from 'firebase/auth';
  import getUser from '../../composables/getUser';

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
      const { currentUser } = getUser();

      //nav bar logout
      const logout = () => {
        signOut(auth)
          .then(() => console.log('Signed out'))
          .then(() => router.push('/login'))
          .catch((err) => alert(err.message));
      };
      return { currentUser, logout };
    }
  };

</script>

<style lang="scss" module scoped>
  @import "./Header.module.scss";
</style>
