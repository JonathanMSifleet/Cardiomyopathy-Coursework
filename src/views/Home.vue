<template>
  <div class="home">
    <title>Home</title>
    <Register></Register>
    <PassReset></PassReset>
  </div>
</template>

<script>
  import Register from '../components/PassReset.vue'
  import PassReset from '../components/PassReset.vue'
  export default {
    name: 'Home',
    component: {
      Register,
      PassReset
    }
  }
</script>
