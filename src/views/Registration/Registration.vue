<template>
  <PageWrapper>
    <div class="login w-100 p-4 d-flex align-items-center justify-content-center" style="height: 70%">
      <MDBCard :class="$style['authentication-card']" text="center">
        <MDBCardHeader>User Registration</MDBCardHeader>
        <MDBCardBody>
          <MDBCardTitle>
            <!--print any google auth errors-->
            <div v-if="signupError" :class="[$style['error-message'], 'mb-4']">
              {{ signupError }}
            </div>
            <div v-if="passMatchErr" :class="[$style['error-message'], 'mb-4']">
              {{ passMatchErr }}
            </div>
          </MDBCardTitle>
          <MDBCardText>
            <form @submit.prevent="handleSubmit">
              <MDBRow>
                <MDBCol md="6">
                  <MDBInput
                    id="form2FirstName"
                    v-model.trim="firstName"
                    type="text"
                    label="First Name"
                    wrapper-class="mb-4"
                    <<<<<<<
                    HEAD
                    :maxlength="32"
                    =="====="
                    :maxlength="20"
                  >
                    >>>>>> main
                    required
                    />
                  </mdbinput>
                </MDBCol>
                <MDBCol md="6">
                  <MDBInput
                    id="form2LastName"
                    v-model.trim="lastName"
                    type="text"
                    label="Last Name"
                    wrapper-class="mb-4"
                    <<<<<<<
                    HEAD
                    :maxlength="32"
                    =="====="
                    :maxlength="20"
                  >
                    >>>>>> main
                    required
                    />
                  </mdbinput>
                </MDBCol>
              </MDBRow>
              <MDBInput
                id="form2Email"
                v-model.trim="email"
                type="email"
                label="Email address"
                wrapper-class="mb-4"
                <<<<<<<
                HEAD
                :maxlength="320"
                =="====="
                :maxlength="30"
              >
                >>>>>> main
                required
                />
                <!-- Password input -->
                <MDBInput
                  id="form2Password"
                  v-model.trim="password"
                  type="password"
                  label="Password"
                  wrapper-class="mb-4"
                  :maxlength="64"
                  required
                />
                <MDBInput
                  id="form2PasswordConfirm"
                  v-model.trim="passConfirm"
                  type="password"
                  label="Confirm Password"
                  wrapper-class="mb-4"
                  :maxlength="64"
                  required
                />
                <MDBInput
                  id="form2Phone"
                  v-model.trim="phone"
                  type="text"
                  label="Phone Number"
                  wrapper-class="mb-4"
                  :maxlength="15"
                  required
                />
                <MDBInput
                  id="form2AddressLineOne"
                  v-model.trim="addressLineOne"
                  type="text"
                  label="Address line 1"
                  wrapper-class="mb-4"
                  :maxlength="35"
                  required
                />
                <MDBInput
                  id="form2AddressLineTwo"
                  v-model.trim="addressLineTwo"
                  type="text"
                  label="Address line 2"
                  wrapper-class="mb-4"
                  :maxlength="35"
                />
                <MDBInput
                  id="form2city"
                  v-model.trim="city"
                  type="text"
                  label="Town / city"
                  wrapper-class="mb-4"
                  :maxlength="35"
                />
                <MDBInput
                  id="form2postcode"
                  v-model.trim="postcode"
                  type="text"
                  label="Postcode"
                  wrapper-class="mb-4"
                  :maxlength="8"
                />

                <MDBBtn type="submit" color="primary" :disabled="!canRegister">
                  Register
                </MDBBtn>
              </mdbinput>
            </form>
          </MDBCardText>
        </MDBCardBody>
        <MDBCardFooter>
          <!-- Register buttons -->
          <div class="text-center mt-3">
            <p>
              Already a member?
              <router-link :to="{ name: 'Login' }" :class="$style['register-link']">
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
  import getUser from '../../composables/getUser';
  import store from '../../services/store.js';
  import useSignup from '../../composables/useSignup';
  import { auth } from '../../firebase/config';
  import { doc, setDoc } from 'firebase/firestore';
  import { ref, watch } from 'vue';
  import { sendEmailVerification, signOut, updateProfile } from 'firebase/auth';
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
  import { validateEmail, validateName, validatePassword, validatePhoneNumber } from '../../utils/validationFunctions';

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
      const addressLineOne = ref('');
      const addressLineTwo = ref(null);
      let canRegister = ref(false);
      const city = ref('');
      const country = ref('');
      const email = ref('');
      const firstName = ref('');
      const lastName = ref('');
      const passConfirm = ref('');
      const passMatchErr = ref('');
      const password = ref('');
      const phone = ref('');
      const postcode = ref ('');
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
      const handleSubmit = async () => {
        // check all inputs are valid:
        if (validateInputs()) return;

        //create user acc
        await signup(email.value, password.value);
        if (signupError.value) return;

        //send email for the user to verify email
        await sendEmailVerification(auth.currentUser);
        alert('Verification email sent.');

        //get currently signed in user
        const { currentUser } = getUser();

        try {
          updateProfile(auth.currentUser, {
            displayName: firstName.value,
            uid: currentUser.value.uid,
            firstName: firstName.value,
            lastName: lastName.value,
            address: {
              addressLineOne: addressLineOne.value,
              addressLineTwo: addressLineTwo.value,
              city: city.value
            },
            email: email.value,
            phone: phone.value
          });
        } catch (error) {
          console.error(error);
        }

        //sign user out
        try {
          await signOut(auth);
          //redirect to login
          router.push('/');
        } catch (error){
          console.error(error);
        }
      };

      const validateInputs = () => {
        let inputsValid = true;

        if(!checkPasswordsMatch()) inputsValid = false;

        const firstNameValMessages = validateName(firstName.value);
        const lastNameValMessages = validateName(lastName.value);
        const emailValMessages = validateEmail(email.value);
        const passwordValMessages = validatePassword(password.value);
        const phoneValMessages = validatePhoneNumber(phone.value);
        return inputsValid;
      };

      watch([addressLineOne, city, country, email, firstName, lastName, passConfirm, password, phone, postcode], () => {
        console.log('🚀 ~ file: Registration.vue ~ line 287 ~ watch ~ addressLineOne, city, country, email, firstName, lastName, passConfirm, password, phone, postcode', addressLineOne.value, city.value, country.value, email.value, firstName.value, lastName.value, passConfirm.value, password.value, phone.value, postcode.value);


        canRegister.value =
          addressLineOne.value !== '' &&
          city.value !== '' &&
          email.value !== '' &&
          firstName.value !== '' &&
          lastName.value !== '' &&
          passConfirm.value !== '' &&
          password.value !== '' &&
          phone.value !== '';
      });

      return { addressLineOne, addressLineTwo, canRegister, city, country, email, firstName, handleSubmit, lastName,
               passConfirm, passMatchErr, password, phone, postcode, signupError };
    }
  };
</script>

<style lang="scss" scoped module>
  @import "../../assets/styles/Authentication.scss";
</style>
