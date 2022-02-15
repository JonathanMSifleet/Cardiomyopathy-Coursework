<template>
  <div class="home">
    <title>Home</title>
    <!-- If Logged In-->
    <h1 v-if="currentUser">Welcome, {{ name }}</h1>
  </div>
  <br />
</template>

<script>
  import { ref, onBeforeMount } from 'vue';
  import getUser from '../composables/getUser';

  export default {
    name: 'Home',
    setup() {
      const { currentUser } = getUser();
      const name = ref('');

      onBeforeMount(() => {
        if (currentUser.value) {
          name.value = currentUser.value.displayName;
        }
      });

      return {
        name,
        currentUser
      };
    }
  }
</script>

