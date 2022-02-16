<template>
  <div id="nav" :class="[$style.nav]">
    <router-link :to="{name: 'Home'}" />
  </div>
  <router-view />
</template>

<style lang="scss" module scoped>
  @import './App.module.scss';
</style>
