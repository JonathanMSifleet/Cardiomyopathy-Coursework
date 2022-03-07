<template>
  <header>
    <MDBNavbar
      :class="['header']"
      expand="lg"
      dark
      bg="primary"
      container
      position="sticky"
    >
      <MDBNavbarBrand>
        <img :class="$style['header-img']" src="../../assets/imgs/logo.png">
      </MDBNavbarBrand>
      <MDBNavbarToggler :class="$style['nav-btn']" target="#navbarExample01" @click="collapse1 = !collapse1" />
      <MDBCollapse id="navbarExample01" v-model="collapse1">
        <MDBNavbarNav left class="mb-2 mb-lg-0">
          <MDBNavbarItem :class="$style['link']" :to="{ name: 'Home' }" active>
            Home
          </MDBNavbarItem>
          <MDBNavbarItem
            v-if="loggedInAndVerif()"
            :class="$style['link']"
            :to="{ name: 'Query' }"
            active
          >
            Query
          </MDBNavbarItem>
          <MDBNavbarItem
            v-if="loggedInAndVerif()"
            :class="$style['link']"
            :to="{ name: 'MutationComparison' }"
            active
          >
            Mutation Comparison
          </MDBNavbarItem>
          <MDBNavbarItem
            v-if="loggedInAndVerif()"
            :class="$style['link']"
            :to="{ name: 'ExperimentalData' }"
            active
          >
            Experimental Data
          </MDBNavbarItem>
        </MDBNavbarNav>
        <MDBNavbarNav right class="mb-2 mb-lg-0">
          <MDBNavbarItem
            v-if="showLoginRegister()"
            :class="$style['link']"
            :to="{ name: 'Login' }"
            active
          >
            Login
          </MDBNavbarItem>
          <MDBNavbarItem
            v-if="showLoginRegister()"
            :class="$style['link']"
            :to="{ name: 'Registration' }"
            active
          >
            Register
          </MDBNavbarItem>
          <MDBNavbarItem
            v-if="loggedInAndVerif()"
            :class="$style['link']"
            :to="{ name: 'UserProfile' }"
            active
          >
            Profile
          </MDBNavbarItem>
          <MDBNavbarItem :class="$style['link']" :to="{ name: 'Help' }" active>
            Need Help?
          </MDBNavbarItem>
          <MDBBtn
            v-if="loggedInAndVerif()"
            :class="$style['logout']"
            class="logout"
            color="light"
            @click="logout"
          >
            Logout
          </MDBBtn>
        </MDBNavbarNav>
      </MDBCollapse>
    </MDBNavbar>
  </header>
</template>

<script>
  import getUser from '../../composables/getUser';
  import {
    MDBBtn,
    MDBNavbar,
    MDBNavbarToggler,
    MDBNavbarBrand,
    MDBNavbarNav,
    MDBNavbarItem,
    MDBCollapse
  } from 'mdb-vue-ui-kit';
  import { getAuth, signOut }  from 'firebase/auth';
  import { useRouter } from 'vue-router';
  import { ref } from 'vue';

  export default {
    components: {
      MDBBtn,
      MDBNavbar,
      MDBNavbarToggler,
      MDBNavbarBrand,
      MDBNavbarNav,
      MDBNavbarItem,
      MDBCollapse
    },
    setup () {
      const router = useRouter();
      const auth = getAuth();
      const { currentUser } = getUser();
      //checks if user is logged in and also email verified

      const collapse1 = ref(false);

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

      return { currentUser, logout, loggedInAndVerif, showLoginRegister, collapse1 };
    }
  };
</script>

<style lang="scss" module scoped>
  @import "./Header.module.scss";
</style>
