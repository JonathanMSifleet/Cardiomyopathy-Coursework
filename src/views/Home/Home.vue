<template>
  <PageWrapper>
    <div class="home">
      <title>Home</title>
      <!-- If Logged In-->
      <!-- <h1 v-if="currentUser">Welcome, {{ name }}</h1> -->
    </div>
    <br />
  </PageWrapper>
</template>

<script>
  import PageWrapper from '../../components/PageWrapper/PageWrapper';
  // import { ref, onBeforeMount } from 'vue';
  // import getUser from '../composables/getUser';

  export default {
    name: 'Home',
    components: {
      PageWrapper
    },
    setup() {
      // const { currentUser } = getUser();
      // const name = ref('');

      // onBeforeMount(() => {
      //   if (currentUser.value) {
      //     name.value = currentUser.value.displayName;
      //   }
      // });

      return {
        // name,
        // currentUser
      };
    }
  }
</script>
