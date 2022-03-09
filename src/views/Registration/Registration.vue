<template>
  <PageWrapper>
    <div class="login w-100 p-4 d-flex align-items-center justify-content-center" style="height: 70%">
      <MDBCard :class="$style['registration-card']" text="center">
        <MDBCardHeader :class="[$style['card-header'], 'mt-3']">
          User Registration
        </MDBCardHeader>
        <MDBCardBody>
          <MDBCardTitle>
            <!--print any google auth errors-->
            <div v-if="signupError" :class="[$style['error-message'], 'mb-4']">
              <img src="https://i.imgur.com/GnyDvKN.png" alt="Red cross"> {{ signupError }}
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
                    :maxlength="32"
                    required
                  />
                </MDBCol>
                <MDBCol md="6">
                  <MDBInput
                    id="form2LastName"
                    v-model.trim="lastName"
                    type="text"
                    label="Last Name"
                    wrapper-class="mb-4"
                    :maxlength="32"
                    required
                  />
                </MDBCol>
              </MDBRow>
              <MDBInput
                id="form2Email"
                v-model.trim="email"
                type="email"
                label="Email address"
                wrapper-class="mb-4"
                :maxlength="320"
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
            </form>
          </MDBCardText>
        </MDBCardBody>
        <MDBCardFooter>
          <!-- Register buttons -->
          <div class="text-center">
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
  import store from '../../services/store';
  import useSignup from '../../composables/useSignup';
  import { auth } from '../../firebase/config';
  import { doc, setDoc } from 'firebase/firestore';
  import { ref, watch } from 'vue';
  import { sendEmailVerification, signOut, updateProfile } from 'firebase/auth';
  import { useRouter } from 'vue-router';
  import { validateAddressLineOne,
           validateAddressLineTwo,
           validateCity,
           validateEmail,
           validateName,
           validatePassword,
           validatePhoneNumber,
           validatePostcode }
    from '../../utils/validationFunctions';
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
    name: 'Register',
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
      const addressLineOne = ref('');
      const addressLineTwo = ref(null);
      let canRegister = ref(false);
      const city = ref('');
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
        if (!validateInputs()) return;

        //create user acc
        await signup(email.value, password.value);
        if (signupError.value) return;

        //povides url to continue to after clicking on verif link
        const actionCodeSettings = {
          //change to domain address of production site
          url: 'https://advwebdevproject-7d239.web.app/'
        };
        if (process.env.DEVELOPMENT) actionCodeSettings.url = 'http://localhost:8080/';

        //send email for the user to verify email
        await sendEmailVerification(auth.currentUser, actionCodeSettings);
        alert('Verification email sent.');

        //get currently signed in user
        const { currentUser } = getUser();

        await addUserInfo({
          uid: currentUser.value.uid,
          firstName: firstName.value,
          lastName: lastName.value,
          address: {
            addressLineOne: addressLineOne.value,
            addressLineTwo: addressLineTwo.value,
            city: city.value,
            postcode: postcode.value
          },
          email: email.value,
          phone: phone.value
        });

        try {
          //set user display name
          await updateProfile(auth.currentUser, {
            displayName: firstName.value
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
        const addressLineOneValMessages = validateAddressLineOne(addressLineOne.value);
        const addressLineTwoValMessages = validateAddressLineTwo(addressLineTwo.value);
        const cityValMessages = validateCity(city.value);
        const postcodeValMessages = validatePostcode(postcode.value);

        if (
          firstNameValMessages.length !== 0 ||
          lastNameValMessages.length !== 0 ||
          emailValMessages.length !== 0 ||
          passwordValMessages.length !== 0 ||
          phoneValMessages.length !== 0 ||
          addressLineOneValMessages.length !== 0 ||
          addressLineTwoValMessages.length !== 0 ||
          cityValMessages.length !== 0 ||
          postcodeValMessages.length !== 0
        ) inputsValid = false;

        return inputsValid;
      };

      watch([addressLineOne, city, email, firstName, lastName, passConfirm, password, phone, postcode], () => {
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

      return { addressLineOne, addressLineTwo, canRegister, city, email, firstName, handleSubmit, lastName,
               passConfirm, passMatchErr, password, phone, postcode, signupError };
    }
  };
</script>

<style lang="scss" scoped module>
  @import "../../assets/styles/Authentication.scss";
</style>
