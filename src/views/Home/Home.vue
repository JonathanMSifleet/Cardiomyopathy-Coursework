/* eslint-disable max-len */

<template>
    <h1>{{homePage.title}}</h1>
    <HomeComponent :post="Welcome" />
    <HomeComponent :post="post" v-for="(post, index) in HCM" :key="index"/>
</template>

<script>
  import HomeComponent from '../../components/Home/HomeComponent.vue';
  import { onBeforeMount } from 'vue';
  import getUser from '../../composables/getUser.js';

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
          }
        ],
        user: this.currentUser
      };
    },
    setup() {
      const { currentUser } = getUser();
      let user = null;
      const homePage = { title: 'Welcome' };

      onBeforeMount(() => {
        if (currentUser.value) {
          user = true;
        } 
      });

      return {
        user,
        currentUser,
        homePage
      };
    }
  };
</script>
