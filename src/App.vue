<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>  
    <router-link to="/externalData">External Data</router-link>  

    <!--Show when signed out-->
    | <router-link to="/login" v-if="!currentUser">Login</router-link> 

    <!-- Show when signed in-->
    <button v-if="currentUser" class="logout" @click="logout">Logout</button>
    
  </div>
  <router-view />
</template>

<script>
  import { useRouter } from 'vue-router';
  import { getAuth, signOut }  from 'firebase/auth';
  import getUser from './composables/getUser';
  export default {
    setup () {
      const router = useRouter();
      const auth = getAuth();
      const { currentUser } = getUser();
      
      //nav bar logout
      const logout = () => {
        signOut(auth)
          .then(() => console.log('Signed out'))
          .then(()=> router.push('/login'))
          .catch((err) => alert(err.message));
      };
      return {currentUser, logout};
    }
  };
</script>
<style></style>
