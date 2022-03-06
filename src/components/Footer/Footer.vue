<template>
  <MDBFooter
    bg="primary"
    :text="['center', 'white', 'lg-start']"
  >
    <div class="text-center p-3">
      <a class="text-light" href="https://github.com/JonathanMSifleet/AdvancedWebDevelopmentProj">
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
