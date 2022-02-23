<template>
  <PageWrapper>
    <NewsFeed />
    <h1 v-if="currentUser">Welcome, {{ name }}</h1>
  </PageWrapper>
  <!-- If Logged In-->

</template>

<script>
  import { ref, onBeforeMount } from 'vue';
  import getUser from '../../composables/getUser';
  import PageWrapper from '../../components/PageWrapper/PageWrapper.vue';
  import NewsFeed from '../../components/NewsFeed/NewsFeed.vue';

  export default {
    name: 'Home',
    components: {
      PageWrapper,
      NewsFeed
    },
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
  };
</script>
