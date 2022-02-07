/* eslint-disable vue/script-indent */ /* eslint-disable vue/script-indent */
<template>
  <div class="login">
    <h1>Login</h1>
    <form @submit.prevent="Login">
      <input type="text" placeholder="Email" v-model="email" />
      <input type="password" placeholder="Password" v-model="password" />
      <input type="submit" value="Login" />
      <p><router-link to="/">Forgotten password?</router-link></p>
      <p>Need an account? <router-link to="/">Register here</router-link></p>
    </form>
  </div>
</template>

<script>
  import { ref } from 'vue';
  import firebase from 'firebase/compat/app';
  import 'firebase/compat/auth';

  export default {
    setup() {
      const email = ref('');
      const password = ref('');

      const Login = () => {
        firebase
          .auth()
          .signInWithEmailAndPassword(email.value, password.value)
          .then((data) => {
            alert('success');
            console.log(data);
          })
          .catch((error) => {
            alert(error.message);
            console.log(error);
          });
      };
      return {
        Login,
        email,
        password
      };
    }
  };
</script>

<style></style>
