<template>
  <div :class="$style['information-wrapper']">
    <div :class="$style['information-content']">
      <div>
        <h2>
          {{ post.title }}
        </h2>
        <p :class="$style['content-preview']">
          {{ post.description }}
        </p>
        <p v-if="post.loginRegister">
          <router-link v-if="!post.WelcomeSection" :class="$style['link']" :to="{name: post.link}">
            Go to Login
          </router-link>
        </p>
        <p v-if="post.loginRegister">
          <router-link v-if="!post.WelcomeSection" :class="$style['link']" :to="{name: post.link2}">
            Go to Registration
          </router-link>
        </p>
        <p v-else>
          <router-link v-if="!post.WelcomeSection" :class="$style['link']" :to="{name: post.link}">
            Go to {{ post.title }}
          </router-link>
        </p>
      </div>
    </div>
    <div :class="$style['bg-photo']">
      <img :src="importImage(`../assets/imgs/${post.photo}.jpg`)">
    </div>
  </div>
</template>

<script>
  import importImage from '../../utils/importImage';

  export default {
    name: 'HomeComponent',
    props: ['post'],
    setup() {
      return { importImage };
    }
  };
</script>

<style lang="scss" module scoped>
  @import "../HomeComponent/HomeComponent.module.scss";
</style>
