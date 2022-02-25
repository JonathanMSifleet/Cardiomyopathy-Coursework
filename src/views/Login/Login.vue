<template>
  <PageWrapper>
    <div class="login w-100 p-4 d-flex align-items-center justify-content-center" style="height: 70%">
      <MDBCard :class="$style.authentication-card" text="center">
        <MDBCardHeader>Login</MDBCardHeader>
        <MDBCardBody>
          <MDBCardTitle v-if="errorMessage" :class="[$style.error-message, 'mb-4']">
            {{ errorMessage }}
          </MDBCardTitle>
          <MDBCardText>
            <form @submit.prevent="Login">
              <!-- Email input -->

              <MDBInput
                id="form2Email"
                v-model="email"
                type="email"
                label="Email address"
                wrapper-class="mb-4"
                maxlength="30"
              />
              <!-- Password input -->
              <MDBInput
                id="form2Password"
                v-model="password"
                type="password"
                label="Password"
                wrapper-class="mb-4"
                maxlength="30"
              />
              <!-- 2 column grid layout for inline styling -->
              <MDBRow class="mb-4">
                <MDBCol class="d-flex justify-content-center">
                  <!-- Simple link -->
                  <router-link
                    to="/reset"
                    :class="$style.reset-password-link"
                  >
                    Forgotten password?
                  </router-link>
                </MDBCol>
              </MDBRow>

              <MDBBtn type="submit" color="primary">
                Login
              </MDBBtn>
            </form>
          </MDBCardText>
        </MDBCardBody>
        <MDBCardFooter>
          <!-- Register buttons -->
          <div class="text-center mt-3">
            <p>
              Not a member?
              <router-link
                to="/register"
                :class="$style.register-link"
              >
                Register here
              </router-link>
            </p>
          </div>
        </MDBCardFooter>
      </MDBCard>
    </div>
  </PageWrapper>
</template>

<script>
  import PageWrapper from '../../components/PageWrapper/PageWrapper.vue';
  import { ref } from 'vue';
  import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
  import { useRouter } from 'vue-router';
  import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardFooter,
    MDBCardHeader,
    MDBCardText,
    MDBCardTitle,
    MDBCol,
    MDBInput,
    MDBRow
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
      MDBCardFooter,
      PageWrapper
    },
    setup() {
      const email = ref('');
      const password = ref('');
      const errorMessage = ref();
      const auth = getAuth();
      const router = useRouter();

      const login = async () => {
        try {
          await signInWithEmailAndPassword(auth, email.value, password.value);
          router.push('/');
        } catch(error) {
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
        }
      };

      return { login, email, errorMessage, password };
    }
  };
</script>

<style lang="scss" scoped module>
  @import "../../assets/styles/Authentication.scss";
</style>
