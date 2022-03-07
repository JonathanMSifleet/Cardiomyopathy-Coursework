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
        <div>
          <router-link v-if="!post.WelcomeSection" :class="$style['link']" :to="{name: post.link}">
            Go to {{ post.title }}
          </router-link>
        </div>
      </div>
    </div>
    <div :class="$style['bg-photo']">
      <img :src="require(`../../assets/imgs/${post.photo}.jpg`)">
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
  @import "../HomeComponent/HomeComponent.module.scss";
</style>
