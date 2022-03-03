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
        <MDBNavbarItem v-if="currentUser" :to="{ name: 'Query' }" active>
          Query
        </MDBNavbarItem>
        <MDBNavbarItem v-if="currentUser" :to="{ name: 'ExperimentalData' }" active>
          Experimental Data
        </MDBNavbarItem>
      </MDBNavbarNav>
      <MDBNavbarNav right class="mb-2 mb-lg-0">
        <MDBNavbarItem v-if="!currentUser" :to="{ name: 'Login' }" active>
          Login
        </MDBNavbarItem>
        <MDBNavbarItem v-if="!currentUser" :to="{ name: 'Registration' }" active>
          Register
        </MDBNavbarItem>
        <MDBNavbarItem v-if="currentUser" :to="{ name: 'UserProfile' }" active>
          Profile
        </MDBNavbarItem>
        <MDBNavbarItem :to="{ name: 'Help' }" active>
          Need Help?
        </MDBNavbarItem>
      </MDBNavbarNav>
      <MDBBtn
        v-if="currentUser"
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
      MDBNavbarItem,
      MDBNavbarNav,
      MDBNavbarToggler
    },
    setup () {
      const auth = getAuth();
      const router = useRouter();
      const { currentUser } = getUser();

      //nav bar logout
      const logout = async () => {
        try {
          await signOut(auth);
          router.push('/login');
        } catch (err) {
          alert(err.message);
        }
      };
      return { currentUser, logout };
    }
  };
</script>

<style lang="scss" module scoped>
  @import "./Header.module.scss";
</style>
