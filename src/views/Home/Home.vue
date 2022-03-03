<template>
  <PageWrapper>
    <HomeComponent v-if="!currentUser" :post="Welcome" />
    <HomeComponent v-for="(post, index) in HCM" :key="index" :post="post" />
    <NewsFeed />
  </PageWrapper>
</template>

<script>
  import { ref, onBeforeMount } from 'vue';
  import getUser from '../../composables/getUser';
  import PageWrapper from '../../components/PageWrapper/PageWrapper.vue';
  import HomeComponent from '../../components/Home/HomeComponent.vue';
  import NewsFeed from '../../components/NewsFeed/NewsFeed.vue';

  export default {
    name: 'Home',
    components: {
      PageWrapper,
      HomeComponent,
      NewsFeed
    },
    setup() {
      const { currentUser } = getUser();
      const name = ref('');

      onBeforeMount(() => {
        if (!currentUser.value) return;

        name.value = currentUser.value.displayName;
      });

      const hcmDesc1 = 'Hypertrophic cardiomyopathy (HCM) is a disease in which the heart muscle ';
      const hcmDesc2 = 'becomes abnormally thick...';

      return {
        Welcome: {
          title: 'COMPANY TITLE',
          description: 'this will be content to explain a bit about the site',
          WelcomeSection: true,
          photo: 'hcm'
        },
        HCM: [
          {
            title: 'Hypertrophic cardiomyopathy (HCM)',
            description: hcmDesc1+hcmDesc2,
            photo: 'hcm',
            link : 'https://www.nhs.uk/conditions/cardiomyopathy/#:~:text=In%20hypertrophic%20cardiomyopathy%2C%20the%20heart,the%20heart%20may%20be%20obstructed.'
          },
          {
            title: 'Hypertrophic cardiomyopathy (HCM)',
            description: hcmDesc1+hcmDesc2,
            photo: 'hcm',
            link : 'https://www.nhs.uk/conditions/cardiomyopathy/#:~:text=In%20hypertrophic%20cardiomyopathy%2C%20the%20heart,the%20heart%20may%20be%20obstructed.'
          }
        ],
        currentUser
      };
    }
  };
</script>
