<template>
  <PageWrapper>
    <FileUpload />
    <NewsFeed />
  </PageWrapper>
</template>

<script>
  import FileUpload from '../../components/FileUpload/FileUpload.vue';
  import NewsFeed from '../../components/NewsFeed/NewsFeed.vue';
  import PageWrapper from '../../components/PageWrapper/PageWrapper.vue';

  export default {
    name: 'Home',
    components: {
      FileUpload, NewsFeed, PageWrapper
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
