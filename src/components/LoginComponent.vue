<template>
  <div class="login w-100 p-4 d-flex align-items-center justify-content-center" style="height: 70%">
    <MDBCard class="authentication-card" text="center">
      <MDBCardHeader>Login</MDBCardHeader>
      <MDBCardBody>
        <MDBCardTitle v-if="errorMessage" class="error-message mb-4">
          {{ errorMessage }}
        </MDBCardTitle>
        <MDBCardText>
          <form @submit.prevent="Login">
            <!-- Email input -->

            <MDBInput
              type="email"
              label="Email address"
              id="form2Email"
              v-model="email"
              wrapperClass="mb-4"
            />
            <!-- Password input -->
            <MDBInput
              type="password"
              label="Password"
              id="form2Password"
              v-model="password"
              wrapperClass="mb-4"
            />
            <!-- 2 column grid layout for inline styling -->
            <MDBRow class="mb-4">
              <MDBCol class="d-flex justify-content-center">
                <!-- Simple link -->
                <router-link
                  to="/reset"
                  class="reset-password-link"
                >
                  Forgotten password?
                </router-link>
              </MDBCol>
            </MDBRow>

            <MDBBtn type="submit" color="primary">Login</MDBBtn>
          </form>
        </MDBCardText>
      </MDBCardBody>
      <MDBCardFooter>
        <!-- Register buttons -->
        <div class="text-center mt-3">
          <p>
            Not a member?
            <router-link
              to ="/register"
              class="register-link"
            >Register here</router-link
            >
          </p>
        </div>
      </MDBCardFooter>
    </MDBCard>
  </div>
</template>

<script>
  import { ref } from 'vue';
  import { getAuth } from 'firebase/auth';
  import { signInWithEmailAndPassword } from 'firebase/auth';
  import { useRouter } from 'vue-router';
  import {
    MDBRow,
    MDBCol,
    MDBInput,
    MDBBtn,
    MDBCard,
    MDBCardHeader,
    MDBCardBody,
    MDBCardTitle,
    MDBCardText,
    MDBCardFooter
  } from 'mdb-vue-ui-kit';
  export default {
    name: 'Login',
    components: {
      MDBRow,
      MDBCol,
      MDBInput,
      MDBBtn,
      MDBCard,
      MDBCardHeader,
      MDBCardBody,
      MDBCardTitle,
      MDBCardText,
      MDBCardFooter
    },
    setup() {
      const email = ref('');
      const password = ref('');
      const errorMessage = ref();
      const auth = getAuth();
      const router = useRouter();

      const Login = () => {
        signInWithEmailAndPassword(auth, email.value, password.value)
          .then(() => {
            router.push('/');
          })
          .catch((error) => {
            //custom error messages
            switch (error.code) {
            case 'auth/invalid-email':
              errorMessage.value = 'Invalid email';
              break;
            case 'auth/user-not-found':
              errorMessage.value = 'No account with that email was found';
              break;
            case 'auth/wrong-password':
              errorMessage.value = 'Incorrect password';
              break;
            default:
              errorMessage.value = 'Email or password was incorrect';
              break;
            }
          });
      };
      return {
        Login,
        email,
        password,
        errorMessage
      };
    }
  };
</script>

<style>
@import "../assets/styles/Authentication.scss";
</style>
