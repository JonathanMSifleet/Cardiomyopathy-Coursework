<template>
  <PageWrapper>
    <div class="login w-100 p-4 d-flex align-items-center justify-content-center" style="height: 70%">
      <MDBCard class="authentication-card" text="center">
        <MDBCardHeader>User Registration</MDBCardHeader>
        <MDBCardBody>
          <MDBCardTitle>
            <!--print any google auth errors-->
            <div v-if="signupError" class="error-message mb-4">
              {{ signupError }}
            </div>
            <div v-if="passMatchErr" class="error-message mb-4">
              {{ passMatchErr }}
            </div>
          </MDBCardTitle>
          <MDBCardText>
            <form @submit.prevent="handleSubmit">
              <MDBRow>
                <MDBCol md="6">
                  <MDBInput
                    id="form2FirstName"
                    v-model="firstName"
                    type="text"
                    label="First Name"
                    wrapper-class="mb-4"
                    maxlength="20"
                    required
                  />
                </MDBCol>
                <MDBCol md="6">
                  <MDBInput
                    id="form2LastName"
                    v-model="lastName"
                    type="text"
                    label="Last Name"
                    wrapper-class="mb-4"
                    maxlength="20"
                    required
                  />
                </MDBCol>
              </MDBRow>
              <MDBInput
                id="form2Email"
                v-model="email"
                type="email"
                label="Email address"
                wrapper-class="mb-4"
                maxlength="30"
                required
              />
              <!-- Password input -->
              <MDBInput
                id="form2Password"
                v-model="password"
                type="password"
                label="Password"
                wrapper-class="mb-4"
                maxlength="30"
                required
              />
              <MDBInput
                id="form2Password"
                v-model="passConfirm"
                type="password"
                label="Confirm Password"
                wrapper-class="mb-4"
                maxlength="30"
                required
              />
              <MDBInput
                id="form2Phone"
                v-model="phone"
                type="number"
                label="Phone Number"
                wrapper-class="mb-4"
                maxlength="15"
                required
              />
              <MDBInput
                id="form2Address"
                v-model="address"
                type="text"
                label="Address"
                wrapper-class="mb-4"
                maxlength="35"
                required
              />

              <MDBBtn type="submit" color="primary">
                Register
              </MDBBtn>
            </form>
          </MDBCardText>
        </MDBCardBody>
        <MDBCardFooter>
          <!-- Register buttons -->
          <div class="text-center mt-3">
            <p>
              Already a member?
              <router-link :to="{ name: 'Login' }" class="register-link">
                Login here
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
  import { useRouter } from 'vue-router';
  import { auth } from '../../firebase/config';
  import { sendEmailVerification, signOut, updateProfile } from 'firebase/auth';
  import { doc, setDoc } from 'firebase/firestore';
  import useSignup from '../../composables/useSignup';
  import getUser from '../../composables/getUser';
  import store from '../../services/store.js';
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
    name: 'Register',
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
      const address = ref('');
      const email = ref('');
      const firstName = ref('');
      const lastName = ref('');
      const passConfirm = ref('');
      const passMatchErr = ref('');
      const password = ref('');
      const phone = ref('');
      const router = useRouter();
      const { signupError, signup } = useSignup();

      //in firebase firestore, create collection called users
      //change db rules to: write: if request.auth != null;
      //for this to work (if not in test mode)
      const addUserInfo = async (userObj) => {
        //create new user doc in user collection
        const db = await store.database;
        await setDoc(doc(db, 'users', userObj.uid), userObj);
      };

      //compare the 2 password inputs
      const checkPasswordsMatch = () => {
        const passwordsMatch =
          password.value === passConfirm.value &&
          password.value !== '';

        passMatchErr.value = !passwordsMatch
          ? 'Your passwords do not match! Please try again'
          : null;
        return passwordsMatch;
      };

      //submit registration data and create account
      const handleSubmit = async ()=> {
        //exit function if password confirmation does not match
        if(!checkPasswordsMatch()) return;

        //create user acc
        await signup(email.value, password.value);

        if (!signupError.value) {//success

          //send email for the user to verify email
          await sendEmailVerification(auth.currentUser);
          alert('Verification email sent.');

          //get currently signed in user
          const { currentUser } = getUser();

          //create user info object
          const user = {
            uid: currentUser.value.uid,
            firstName: firstName.value,
            lastName: lastName.value,
            address: address.value,
            email: email.value,
            phone: phone.value
          };
          //add user info to firestore db
          await addUserInfo(user);

          //set user display name
          updateProfile(auth.currentUser, {
            displayName: firstName.value
          }).catch((error) => {
            console.log(error);
          });

          //sign user out
          try{
            await signOut(auth);
            console.log('Signed Out');
            //redirect to login
            router.push('/');
          }
          catch(error){
            console.log(error);
          }
        }
      };
      return { email, password, handleSubmit, signupError,
               phone, address, firstName, lastName, passMatchErr, passConfirm };
    }
  };
</script>

<style>
  @import "../../assets/styles/Authentication.scss";
</style>
