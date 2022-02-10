<template>
  <div class="login">
    <h1>Login</h1>
    <form @submit.prevent="Login">
      <input type="text" placeholder="Email" v-model="email" />
      <input type="password" placeholder="Password" v-model="password" />
      <input type="submit" value="Login" />
      <p v-if="errorMessage">{{ errorMessage }}</p>
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
      const errorMessage = ref();

      const Login = () => {
        firebase
          .auth()
          .signInWithEmailAndPassword(email.value, password.value)
          .then((data) => {
            console.log(data);
          })
          .catch((error) => {
            switch (error.code) {
            case 'auth/invalid-email':
              errorMessage.value = 'Invalid email';
              break;
            case 'auth/user-not-found':
              errorMessage.value = 'No account with that email was found';
              break;
            case 'auth/wrong-password':
              errorMessage.value = 'Incorrect password';
              break;
            default:
              errorMessage.value = 'Email or password was incorrect';
              break;
            }
          });
      };
      return {
        Login,
        email,
        password,
        errorMessage
      };
    }
  };
</script>

<style></style>
