<template>
  <PageWrapper>
    <HomeComponent v-for="(post, index) in HCM" :key="index" :post="post" />
    <NewsFeed />
  </PageWrapper>
</template>

<script>
  import PageWrapper from '../../components/PageWrapper/PageWrapper.vue';
  import HomeComponent from '../../components/Home/HomeComponent.vue';
  import NewsFeed from '../../components/NewsFeed/NewsFeed.vue';
  export default {
    name: 'Help',
    components: {
      PageWrapper,
      HomeComponent,
      NewsFeed
    },
    data(){
      return {
        HCM: [
          {
            title: 'Query',
            description: 'query is',
            photo: 'hcm'
          },
          {
            title: 'help 2',
            description: 'help 2',
            photo: 'query-page'
          }
        ]
      };
    }
  };
</script>
