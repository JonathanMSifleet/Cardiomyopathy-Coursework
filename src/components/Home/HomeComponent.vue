/* eslint-disable max-len */

<template>
  <div :class="[$style['information-wrapper'], false ? '' : $style['no-user']]">
    <div :class="[$style['information-content']]">
      <div>
        <h2 v-if="post.WelcomeSection">
          {{ post.title }}
        </h2>
        <h2 v-else>
          {{ post.title }}
        </h2>
        <p v-if="post.WelcomeSection">
          {{ post.description }}
        </p>
        <p v-else :class="[$style['content-preview']]">
          {{ post.description }}
        </p>
        <!-- <div v-if="!post.user" v-on="post.user"> -->
        <router-link v-if="post.WelcomeSection" :class="[$style['link'],$style['link-light']]" :to="{name: 'Login'}">
          Login/Register
        </router-link>
        <!-- </div> -->
        <div>
          <router-link v-if="!post.WelcomeSection" :class="[$style['link']]" to="#">
            Read More
          </router-link>
        </div>
      </div>
    </div>
    <div :class="[$style['bg-photo']]">
      <img src="../../assets/imgs/hcm.jpg">
    </div>
  </div>
</template>

<script>
  import getUser from '../../composables/getUser';
  export default {
    name: 'HomeComponent',
    // eslint-disable-next-line vue/require-prop-types
    props: ['post'],
    setup () {
      const { currentUser } = getUser();
      const userBoolean = Boolean(true);
      return (currentUser, userBoolean);
    }
  };
</script>

<style lang="scss" module scoped>
@import "./HomeComponent.module.scss";
</style>
