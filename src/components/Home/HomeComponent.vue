<template>
  <div :class="[$style['information-wrapper'], user ? '' : $style['no-user']]">
    <div :class="$style['information-content']">
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
        <router-link v-if="post.WelcomeSection" :class="[$style['link'], $style['link-light']]" :to="{name: 'Login'}">
          Login/Register
        </router-link>
        <div v-if="!post.WelcomeSection">
          <a :class="$style['link']" :href="post.link" target="_blank">
            Read More
          </a>
        </div>
      </div>
    </div>
    <div :class="$style['bg-photo']">
      <img :src="require(`../../assets/imgs/${post.photo}.jpg`)">
    </div>
  </div>
</template>

<script>
  import getUser from '../../composables/getUser';
  import { ref, onBeforeMount } from 'vue';

  export default {
    name: 'HomeComponent',
    props: {
      post: {
        type: Object,
        default() { return; }
      }
    },
    setup(){
      const { currentUser } = getUser();
      const user = ref(false);

      onBeforeMount(() => {
        if (currentUser.value) {
          user.value = true;
        }
      });
      return{ user };
    }
  };
</script>

<style lang="scss" module scoped>
  @import "./HomeComponent.module.scss";
</style>
