<template>
  <div class="home">
    <HelloWorld msg="Welcome to My Vue.js App" />
  </div>
</template>

<script>
  import HelloWorld from '../components/HelloWorld.vue';

  export default {
    name: 'Home',
    components: {
      HelloWorld
    }
  };
</script>
