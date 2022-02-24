<template>
  <MDBBtn color="primary" disabled>
    <MDBSpinner tag="span" size="sm" />
  </MDBBtn>
</template>

<script>
  import { MDBSpinner, MDBBtn } from 'mdb-vue-ui-kit';

  export default {
    components: {
      MDBSpinner,
      MDBBtn
    }
  };
</script>
