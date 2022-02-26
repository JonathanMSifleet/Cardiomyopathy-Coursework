<template>
  <div class="login w-100 p-4 d-flex align-items-center justify-content-center" style="height: 70%">
    <MDBCard class="authentication-card" text="center">
      <MDBCardHeader>Reset Password</MDBCardHeader>
      <MDBCardBody>
        <MDBCardTitle v-if="error" class="error-message mb-4">
          {{ error }}
        </MDBCardTitle>
        <MDBCardText>
          <form @submit.prevent="handleSubmit">
            <MDBInput
              id="form2Email"
              v-model="email"
              type="email"
              label="Email address"
              wrapper-class="mb-4"
            />
            <MDBBtn type="submit" color="primary">
              Send reset email
            </MDBBtn>
          </form>
        </MDBCardText>
      </MDBCardBody>
    </MDBCard>
  </div>
</template>

<script>
  import { ref } from 'vue';
  import usePassReset from '../../composables/passReset';
  import {
    MDBInput,
    MDBBtn,
    MDBCard,
    MDBCardHeader,
    MDBCardBody,
    MDBCardTitle,
    MDBCardText
  } from 'mdb-vue-ui-kit';
  export default {
    name: 'PassReset',
    components: {
      MDBInput,
      MDBBtn,
      MDBCard,
      MDBCardHeader,
      MDBCardBody,
      MDBCardTitle,
      MDBCardText
    },
    setup(){
      const email = ref('');
      const { error, passReset } = usePassReset();

      const handleSubmit = async ()=> {
        //attempt to send reset email
        await passReset(email.value);
        if (!error.value ) alert('Password reset email sent');
      };
      return { email, handleSubmit, error };
    }
  };
</script>

<style>
  @import "../../assets/styles/Authentication.scss";
</style>
