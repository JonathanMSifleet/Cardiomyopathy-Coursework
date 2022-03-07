<template>
  <PageWrapper>
    <div class="login w-100 p-4 d-flex align-items-center justify-content-center" style="height: 70%">
      <MDBCard :class="$style['login-card']" text="center">
        <MDBCardHeader :class="$style['card-header']">Login</MDBCardHeader>
        <MDBCardBody>
          <MDBCardTitle v-if="errorMessage" :class="[$style['error-message'], 'mb-4']">
            <img src="https://i.imgur.com/GnyDvKN.png" alt="Red cross"> {{ errorMessage }}
          </MDBCardTitle>
          <MDBCardText>
            <form @submit.prevent="login">
              <!-- Email input -->
              <MDBInput
                id="form2Email"
                v-model="email"
                type="email"
                label="Email address"
                wrapper-class="mb-4"
                :maxlength="320"
              />

              <!-- Password input -->
              <MDBInput
                id="form2Password"
                v-model="password"
                type="password"
                label="Password"
                wrapper-class="mb-4"
                :maxlength="64"
              />
              <!-- 2 column grid layout for inline styling -->
              <MDBRow class="mb-4">
                <MDBCol class="d-flex justify-content-center">
                  <!-- Simple link -->
                  <router-link
                    to="/reset"
                    :class="$style['reset-password-link']"
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
          <div class="text-center">
            <p>
              Not a member?
              <router-link
                to="/register"
                :class="$style['register-link']"
              >
                Create an account
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
  import getUser from '../../composables/getUser.js';
  import { getAuth, signInWithEmailAndPassword, signOut, sendEmailVerification } from 'firebase/auth';
  import { ref } from 'vue';
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
      MDBBtn,
      MDBCard,
      MDBCardBody,
      MDBCardFooter,
      MDBCardHeader,
      MDBCardText,
      MDBCardTitle,
      MDBCol,
      MDBInput,
      MDBRow,
      PageWrapper
    },
    setup() {
      //provides url to continue to after clicking on verif link
      let actionCodeSettings = {
        url: 'https://advwebdevproject-7d239.web.app/'
      };
      if (process.env.DEVELOPMENT) actionCodeSettings.url = 'http://localhost:8080/';
      const auth = getAuth();
      const email = ref('');
      const errorMessage = ref();
      const password = ref('');
      const router = useRouter();
      const { currentUser } = getUser();

      const login = async () => {
        try {
          await signInWithEmailAndPassword(auth, email.value, password.value);
          if (process.env.DEVELOPMENT) console.log(currentUser.value.emailVerified);
          await currentUser.value.reload();
          if (process.env.DEVELOPMENT) console.log(currentUser.value.emailVerified);

          if (!currentUser.value.emailVerified) {
            await sendEmailVerification(auth.currentUser, actionCodeSettings);
            if (process.env.DEVELOPMENT) console.log(auth.currentUser);
            await signOut(auth);

            if (process.env.DEVELOPMENT) console.log('SIGNED OUT');
            if (process.env.DEVELOPMENT) console.log(auth.currentUser);
            const verifError = new Error();
            verifError.code = 'email-not-verif';
            throw verifError;
          } else {
            router.push('/');
          }

        } catch (error) {
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
          case 'email-not-verif':
            errorMessage.value = 'Please verify your email before login. Email resent.';
            break;
          default:
            console.log('DEFAULT');
            errorMessage.value = error.message;
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
