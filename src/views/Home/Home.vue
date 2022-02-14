/* eslint-disable vue/no-unused-components */
<template>
  <PageWrapper> <NewsFeed /> </PageWrapper>
</template>

<script>
  import PageWrapper from '../../hoc/PageWrapper/PageWrapper.vue';
  import NewsFeed from '../../components/NewsFeed/NewsFeed.vue';
  export default {
    name: 'Home',
    components: {
      PageWrapper,
      NewsFeed
    },
    setup() {
      const homePage = { title: 'Welcome' };

      return { homePage };
    }
  };
</script>
