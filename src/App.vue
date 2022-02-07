<template>
  <div :class="[$style.nav]" id="nav">
    <router-link to="/"/>
    <router-link to="/Query"/>
  </div>
  <router-view />
</template>

<style lang="scss" module scoped>
  @import './App.module.scss';
</style>
