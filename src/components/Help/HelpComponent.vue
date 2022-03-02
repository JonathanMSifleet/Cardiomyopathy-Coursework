/* eslint-disable max-len */

<template>
  <div :class="[$style['information-wrapper']]">
    <div :class="[$style['information-content']]">
      <div>
        <h2>
          {{ post.title }}
        </h2>
        <p :class="[$style['content-preview']]">
          {{ post.description }}
        </p>
        <div>
          <router-link v-if="!post.WelcomeSection" :class="[$style['link']]" to="#">
            Read More
          </router-link>
        </div>
      </div>
    </div>
    <div :class="[$style['bg-photo']]">
      <img :src="require(`../../assets/imgs/${post.photo}.jpg`)">
    </div>
  </div>
</template>

<script>
  export default {
    name: 'HomeComponent',
    // eslint-disable-next-line vue/require-prop-types
    props: ['post']
  };
</script>

<style lang="scss" module scoped>
@import "../Home/HomeComponent.module.scss";
</style>
