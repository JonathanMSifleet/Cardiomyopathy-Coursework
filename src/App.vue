<template>
  <PageWrapper>
    <router-view />
  </PageWrapper>
</template>


<script>
import PageWrapper from './hoc/PageWrapper/PageWrapper.vue';
import getUser from './composables/getUser.js';
  

export default {
  components: {PageWrapper},
  created(){
    const { currentUser } = getUser();
    const user = currentUser.value; //.uid;
    
    this.$store.commit("updateUser", user);
    if(user){
      console.log()
      this.$store.dispatch("getCurrentUser")
    }
    
  }
}
</script> 

<style lang="scss" module scoped>
  @import './App.module.scss';
</style>
