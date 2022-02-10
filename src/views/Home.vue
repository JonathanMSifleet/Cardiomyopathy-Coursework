/* eslint-disable max-len */
<template>
  <div class="home">
    <title>Home</title>
    <Register></Register>
    <PassReset></PassReset>
    <h1>Welcome, {{ name }}</h1>
  </div>
  <br />
  <button class="logout" @click="Logout">Logout</button>
</template>

<script>
  import Register from '../components/PassReset.vue'
  import PassReset from '../components/PassReset.vue'
  export default {
    name: 'Home',
    component: {
      Register,
      PassReset
  import { ref, onBeforeMount } from 'vue';
  import firebase from 'firebase/compat/app';
  import 'firebase/compat/auth';
  export default {
    setup() {
      const user = firebase.auth().currentUser;

      const name = ref('');

      onBeforeMount(() => {
        if (user) {
          name.value = user.email.split('@')[0];
        }
      });

      const Logout = () => {
        firebase
          .auth()
          .signOut()
          .then(() => console.log('Signed out'))
          .catch((err) => alert(err.message));
      };
      return {
        name,
        Logout
      };
    }
  }
</script>
