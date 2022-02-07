
<template>
  <div class="information-wrapper">
    <div class="information-content"></div>
    <div>
      <h2 v-if="post.WelcomeSection">{{ post.title }}</h2>
      <h2 v-else>{{ post.title }}</h2>
      <h2 v-if="post.WelcomeSection">{{ post.description }}</h2>
      <h2 v-else>{{ post.description }}</h2>
      <router-link class="link link-light" v-if="post.WelcomeSection" to='#'>Login/Register</router-link>
      <router-link v-else to='#'>Read More</router-link>
    </div>
    <div class="bg-photo">
      <img src="../../assets/imgs/hcm-diagram-img.jpg" alt="hcm diagram"> <!--need to turn into a component and parse -->
    </div>
  </div>
</template>

<script>
  export default {
    name: 'HomeComponent',
    props: ['post']
  };
</script>

<style lang="scss" module scoped>
@import "./HomeComponent.module.scss";
</style>