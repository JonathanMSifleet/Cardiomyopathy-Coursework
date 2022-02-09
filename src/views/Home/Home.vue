/* eslint-disable max-len */

<template>
  <PageWrapper>
    <h1>{{homePage.title}}</h1>
    <HomeComponent :post="Welcome"/>
    <HomeComponent :post="post" v-for="(post, index) in HCM" :key="index"/>
  </PageWrapper>
</template>

<script>
  import PageWrapper from '../../hoc/PageWrapper/PageWrapper.vue';
  import HomeComponent from '../../components/Home/HomeComponent.vue';

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
          photo: 'hcm'
        },
        HCM: [
          {
            title: 'Hypertrophic cardiomyopathy (HCM)',
            description: hcmDesc1+hcmDesc2,
            photo: 'hcm'
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
