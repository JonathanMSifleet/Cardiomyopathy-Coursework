<template>
  <div class="information-wrapper">
    <div class="information-content" />
    <div>
      <h2 v-if="post.WelcomeSection">
        {{ post.title }}
      </h2>
      <h2 v-else>
        {{ post.title }}
      </h2>
      <h2 v-if="post.WelcomeSection">
        {{ post.description }}
      </h2>
      <h2 v-else>
        {{ post.description }}
      </h2>
      <router-link v-if="post.WelcomeSection" class="link link-light" to="#">
        Login/Register
      </router-link>
      <router-link v-else to="#">
        Read More
      </router-link>
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
