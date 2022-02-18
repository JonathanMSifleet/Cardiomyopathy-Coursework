<template>
  <MDBFooter
    bg="primary"
    :text="['center', 'white', 'lg-start']"
  >
    <div class="text-center p-3">
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
