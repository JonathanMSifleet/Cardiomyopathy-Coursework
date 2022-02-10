<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/login">Login</router-link> |
    <router-link to="/register">Register</router-link> |
    <router-link to="/reset">Password Reset</router-link>
  </div>
  <router-view />
</template>

<script>
  import { onBeforeMount } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import  { getAuth }  from 'firebase/auth';
  import {onAuthStateChanged } from 'firebase/auth';
  export default {
    setup () {
      const router = useRouter();
      const route = useRoute();
      const auth = getAuth();

      onBeforeMount(() => {
        onAuthStateChanged(auth, (user) => {
          if(!user) {
            router.replace('/login');
          } else if (route.path == '/login') {
            router.replace('/');
          }
        })
      });
    }
  };
</script>
<style></style>
