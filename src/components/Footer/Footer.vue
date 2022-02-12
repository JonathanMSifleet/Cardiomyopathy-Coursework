<template>
  <MDBFooter
    :class="[$style.Footer]"
    :text="['center', 'white', 'lg-start']"
    bg="success"
  >
    <div class="text-center p-3" style="background-color: rgba(0, 0, 0, 0.2)">
      <a class="text-dark" href="https://github.com/MuminRahman2001/advanced-web-project">
        Advanced Web Development Project
      </a>
    </div>
  </MDBFooter>
</template>

<script>
  import { MDBFooter } from 'mdb-vue-ui-kit';
  export default {
    components: {
      MDBFooter
    }
  };
</script>

<style lang="scss" module scoped>
  @import './Footer.module.scss';
</style>
