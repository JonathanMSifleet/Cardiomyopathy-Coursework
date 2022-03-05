<template>
  <PageWrapper>
    <HelpComponent v-for="(post, index) in HCM" :key="index" :post="post" />
  </PageWrapper>
</template>

<script>
  import PageWrapper from '../../components/PageWrapper/PageWrapper.vue';
  import HelpComponent from '../../components/Help/HelpComponent.vue';

  export default {
    name: 'Help',
    components: { HelpComponent, PageWrapper },
    setup() {
      return {
        HCM: [
          {
            title: 'Home',
            description: 'The Homepage is the first page you will see when coming onto the website where you will initially be welcomed and asked to login/register before you are allowed to access or add any data.',
            photo: 'home',
            link: 'Home'
          },
          {
            title: 'Login or Register',
            description: 'In these two pages; you can login if you already have an account with us or you can create an account which you will have to verify via email.',
            photo: 'login-register',
            loginRegister: true,
            link: 'Login',
            link2: 'Registration'
          },
          {
            title: 'Query',
            description: 'In the query page, you can see the different gene mutations and their attributes as well as some information on the mutations. Login is required to have access to this page',
            photo: 'query-page',
            link: 'Query'
          },
          {
            title: 'Experimental Data',
            description: 'In experimental data, you can add/upload your own data. Login is required to have access to this page',
            photo: 'experimental-data',
            link: 'ExperimentalData'
          },
          {
            title: 'Profile',
            description: 'In Profile, you can view your profile as well as;ss view and delete the data you have uploaded. Login is required to have access to this page',
            photo: 'experimental-data',
            link: 'UserProfile'
          }
        ]
      };
    }
  };
</script>
