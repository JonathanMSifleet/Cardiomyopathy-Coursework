<template>
  <PageWrapper>
    <h1>{{homePage.title}}</h1>
    <HomeComponent :post="Welcome"/>
    <HomeComponent :post="post" v-for="(post, index) in HCM" :key="index"/>
  </PageWrapper>
</template>

<script>
  import PageWrapper from '../../hoc/PageWrapper/PageWrapper.vue';
  import HomeComponent from '../../components/HomeComponent.vue';

  export default {
    name: 'Home',
    components: {
      PageWrapper,
      HomeComponent
    },
    data(){
      const hcmDesc1 = 'Hypertrophic cardiomyopathy (HCM) is a disease in which the heart muscle ';
      const hcmDesc2 = 'becomes abnormally thick...';
      return {
        Welcome: {
          title: 'COMPANY TITLE',
          description: 'this will be content to explain a bit about the site',
          WelcomeSection: true,
          photo: 'hcm-diagram-img'
        },
        HCM: [
          {
            title: 'Hypertrophic cardiomyopathy (HCM)',
            description: hcmDesc1+hcmDesc2,
            photo: 'hcm-diagram-img'
          },
          {
            title: 'extra1',
            description: 'extra content 1',
            photo: 'hcm-img'
          }
        ]
      };
    },
    setup() {
      const homePage = { title: 'Welcome' };
      return { homePage };
    }
  };
</script>
