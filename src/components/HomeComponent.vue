
<template>
  <div class="information-wrapper">
    <div class="information-content"></div>
    <div>
      <h2 v-if="post.WelcomeSection">{{ post.title }}</h2>
      <h2 v-else>{{ post.title }}</h2>
      <h2 v-if="post.WelcomeSection">{{ post.description }}</h2>
      <h2 v-else>{{ post.description }}</h2>
      <router-link v-if="post.WelcomeSection" to='#'>Login/Register</router-link>
      <!-- <router-link v-else to='#'></router-link> -->
      <div class="bg-photo">
        <img src="../assets/imgs/hcm-diagram-img.jpg" alt="">
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'HomeComponent',
    props: ['post']
  };
</script>

<style lang="scss" scoped></style>
