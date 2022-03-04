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
        <MDBNavbarItem v-if="loggedInAndVerif()" :to="{ name: 'Query' }" active>
          Query
        </MDBNavbarItem>
        <MDBNavbarItem :to="{ name: 'MutationComparison' }" active>
          Mutation Comparison
        </MDBNavbarItem>
        <MDBNavbarItem v-if="loggedInAndVerif()" :to="{ name: 'ExperimentalData' }" active>
          Experimental Data
        </MDBNavbarItem>
      </MDBNavbarNav>
      <MDBNavbarNav right class="mb-2 mb-lg-0">
        <MDBNavbarItem v-if="showLoginRegister()" :to="{ name: 'Login' }" active>
          Login
        </MDBNavbarItem>
        <MDBNavbarItem v-if="showLoginRegister()" :to="{ name: 'Registration' }" active>
          Register
        </MDBNavbarItem>
        <MDBNavbarItem v-if="loggedInAndVerif()" :to="{ name: 'UserProfile' }" active>
          Profile
        </MDBNavbarItem>
        <MDBNavbarItem :to="{ name: 'Help' }" active>
          Need Help?
        </MDBNavbarItem>
      </MDBNavbarNav>
      <MDBBtn
        v-if="loggedInAndVerif()"
        class="logout"
        color="light"
        @click="logout"
      >
        Logout
      </MDBBtn>
    </MDBNavbar>
  </header>
</template>

<script>
  import getUser from '../../composables/getUser';
  import { MDBBtn, MDBNavbar, MDBNavbarToggler, MDBNavbarNav, MDBNavbarItem } from 'mdb-vue-ui-kit';
  import { getAuth, signOut }  from 'firebase/auth';
  import { useRouter } from 'vue-router';

  export default {
    components: {
      MDBBtn,
      MDBNavbar,
      MDBNavbarToggler,
      MDBNavbarNav,
      MDBNavbarItem
    },
    setup () {
      const router = useRouter();
      const auth = getAuth();
      const { currentUser } = getUser();
      //checks if user is logged in and also email verified

      const loggedInAndVerif = ()=>{
        return (currentUser.value && currentUser.value.emailVerified)
          ? true
          : false;
      };

      const showLoginRegister = ()=>{
        return (!currentUser.value || !currentUser.value.emailVerified)
          ? true
          : false;
      };

      //nav bar logout
      const logout = async () => {
        try {
          await signOut(auth);
          router.push('/login');
        } catch (err) {
          alert(err.message);
        }
      };

      return { currentUser, logout, loggedInAndVerif, showLoginRegister };
    }
  };
</script>

<style lang="scss" module scoped>
  @import "./Header.module.scss";
</style>
