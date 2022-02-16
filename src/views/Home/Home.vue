<template>
  <PageWrapper>
    <div class="home">
      <!-- <h1>{{ homePage.title }}</h1> -->

      <h1 v-if="currentUser">
        Welcome, {{ name }}
      </h1>
    </div>
    <NewsFeed />
  </PageWrapper>
</template>

<script>
  import PageWrapper from '../../hoc/PageWrapper/PageWrapper.vue';
  import NewsFeed from '../../components/NewsFeed/NewsFeed';

  export default {
    name: 'Home',
    components: {
      PageWrapper,
      NewsFeed
    },
    setup() {
      // const { currentUser } = getUser();
      // const name = ref('');

      // onBeforeMount(() => {
      //   if (currentUser.value) {
      //     name.value = currentUser.value.displayName;
      //   }
      // });

      // return {
      //   name,
      //   currentUser
      // };
    }
  };
</script>
