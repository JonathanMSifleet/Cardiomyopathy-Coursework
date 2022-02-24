<template>
  <PageWrapper>
    <NewsFeed />
  </PageWrapper>
</template>

<script>
  import NewsFeed from '../../components/NewsFeed/NewsFeed.vue';
  import PageWrapper from '../../components/PageWrapper/PageWrapper.vue';

  export default {
    name: 'Home',
    components: {
      NewsFeed, PageWrapper
    },
    setup() {}
  };
</script>
