/* eslint-disable max-len */
<template>
  <div class="home">
    <title>Home</title>
    <Register></Register>
    <PassReset></PassReset>
    <h1 v-if="user">Welcome, {{ name }}</h1>
  </div>
  <br />
  <button v-if ="user" class="logout" @click="Logout">Logout</button>
</template>

<script>
  import Register from '../components/PassReset.vue'
  import PassReset from '../components/PassReset.vue'
  import Login from '../components/LoginComponent.vue'
  import { ref, onBeforeMount } from 'vue';
  //import 'firebase/compat/auth';
  import { getAuth, signOut } from 'firebase/auth';
  import { useRouter } from 'vue-router';

  export default {
    name: 'Home',
    component: {
      Register,
      PassReset,
      Login
    },
    setup() {
      const auth = getAuth();
      const user = auth.currentUser;
      console.log(user);
      const router = useRouter();

      const name = ref('');

      onBeforeMount(() => {
        if (user) {
          name.value = user.email.split('@')[0];
        }
      });

      const Logout = () => {
        signOut(auth)
          .then(() => console.log('Signed out'))
          .then(()=> router.push('/login'))
          .catch((err) => alert(err.message));
      };
      return {
        name,
        Logout,
        user
      };
    }
  }
</script>

