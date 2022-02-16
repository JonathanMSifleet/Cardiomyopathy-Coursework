/* eslint-disable max-len */

<template>
  <div class="information-wrapper">
    <div class="information-content"></div>
    <div>
      
      <h2 v-if="post.WelcomeSection">{{ post.title }}</h2>
      <h2 v-else>{{ post.title }}</h2>
      <h2 v-if="post.WelcomeSection">{{ post.description }}</h2>
      <h2 v-else>{{ post.description }}</h2>
      <!-- <div v-if="!post.user" v-on="post.user"> -->
        <router-link class="link link-light" v-if="post.WelcomeSection" :to="{name: 'Login'}">Login/Register</router-link>
      <!-- </div> -->
      <div>
        <router-link v-if="!post.WelcomeSection" to='#'>Read More</router-link>
      </div>
    </div>
    <div class="bg-photo">
      <img :src="require('../../assets/imgs/' + post.photo + '.jpg').default">
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
