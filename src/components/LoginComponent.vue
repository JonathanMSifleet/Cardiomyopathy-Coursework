<template>
  <div class="login">
    <MDBCard text="center">
      <MDBCardHeader>Featured</MDBCardHeader>
      <MDBCardBody>
        <MDBCardTitle>Special title treatment</MDBCardTitle>
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
                <!-- Checkbox -->
                <MDBCheckbox
                  label="Remember me"
                  id="form2LoginCheck"
                  v-model="loginCheck"
                  wrapperClass="mb-3 mb-md-0"
                />
              </MDBCol>
              <p v-if="errorMessage">{{ errorMessage }}</p>
              <MDBCol>
                <!-- Simple link -->
                <router-link :to="{ name: 'PasswordReset' }"
                  >Forgotten password?</router-link
                >
              </MDBCol>
            </MDBRow>
            <!-- Submit button -->
            <MDBBtn type="submit" color="primary" block>Login</MDBBtn>

            <!-- Register buttons -->
            <div class="text-center">
              <p>
                Not a member?
                <router-link :to="{ name: 'Register' }"
                  >Register here</router-link
                >
              </p>
            </div>
          </form>
        </MDBCardText>
        <MDBBtn tag="a" href="#!" color="primary">Button</MDBBtn>
      </MDBCardBody>
      <MDBCardFooter class="text-muted">2 days ago</MDBCardFooter>
    </MDBCard>
  </div>
</template>

<script>
import { ref } from "vue";
import { getAuth } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";
import {
  MDBRow,
  MDBCol,
  MDBInput,
  MDBCheckbox,
  MDBBtn,
  MDBIcon,
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardFooter,
} from "mdb-vue-ui-kit";
export default {
  name: "Login",
  components: {
    MDBRow,
    MDBCol,
    MDBInput,
    MDBCheckbox,
    MDBBtn,
    MDBIcon,
    MDBCard,
    MDBCardHeader,
    MDBCardBody,
    MDBCardTitle,
    MDBCardText,
    MDBCardFooter,
  },
  setup() {
    const email = ref("");
    const password = ref("");
    const loginCheck = ref(true);
    const errorMessage = ref();
    const auth = getAuth();
    const router = useRouter();

    const Login = () => {
      signInWithEmailAndPassword(auth, email.value, password.value)
        .then(() => {
          router.push("/");
        })
        .catch((error) => {
          //custom error messages
          switch (error.code) {
            case "auth/invalid-email":
              errorMessage.value = "Invalid email";
              break;
            case "auth/user-not-found":
              errorMessage.value = "No account with that email was found";
              break;
            case "auth/wrong-password":
              errorMessage.value = "Incorrect password";
              break;
            default:
              errorMessage.value = "Email or password was incorrect";
              break;
          }
        });
    };
    return {
      Login,
      email,
      password,
      loginCheck,
      errorMessage,
    };
  },
};
</script>

<style></style>
