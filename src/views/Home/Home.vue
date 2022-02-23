/* eslint-disable max-len */

<template>
  <h1>{{homePage.title}}</h1>
  <HomeComponent v-if="!user" :post="Welcome" />
  <HomeComponent :post="post" v-for="(post, index) in HCM" :key="index"/>
</template>

<script>
  import HomeComponent from '../../components/Home/HomeComponent.vue';

  export default {
    name: 'Home',
    components: {
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
          },
          {
            title: this.$store.state.accountDisplayName,
            description: this.$store.state.accountEmail,
            photo: 'hcm'
          }
        ]
      };
    },
    setup() {
      const homePage = { title: 'Brand Name' };

      return { homePage };
    },
    computed: {
      user() {
        return this.$store.state.user; //checks if user exists in store and returns boolean
      }
    }
  };
</script>
