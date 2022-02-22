<template>
  <PageWrapper>
    <router-view />
  </PageWrapper>
</template>


<script>
import PageWrapper from './hoc/PageWrapper/PageWrapper.vue';
import { auth } from './firebase/config.js';

export default {
  components: {PageWrapper},
  created(){
    auth.onAuthStateChanged((user) => {
      this.$store.commit("updateUser", user);
      if(user){
        this.$store.dispatch("getCurrentUser");
        console.log(this.$store.state.accountEmail);
      } else {
        console.log(this.$store.state.accountEmail);
      }
    });
  }
}
</script> 

<style lang="scss" module scoped>
  @import './App.module.scss';
</style>
