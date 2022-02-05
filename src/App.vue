<template>
  <router-view />
</template>

<script>
  import { onBeforeMount } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import firebase from 'firebase/compat/app';
  import 'firebase/compat/auth';
  export default {
    setup () {
      const router = useRouter();
      const route = useRoute();

      onBeforeMount(() => {
        firebase.auth().onAuthStateChanged((user) => {
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
