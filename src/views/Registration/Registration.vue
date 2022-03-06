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
                <MDBRow>
                  <div
                    v-for="message in firstNameValMessages" 
                    v-if="firstNameValMessages!=='[]'" 
                    :class="[$style['error-message'], 'mb-4']"
                  >
                    {{ message }}
                  </div>
                </MDBRow>
                <MDBRow>
                  <div
                    v-for="message in lastNameValMessages" 
                    v-if="lastNameValMessages!=='[]'" 
                  :class="[$style['error-message'], 'mb-4']"
                  >
                    {{ message }}
                  </div>
                  
                </MDBRow>
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
              <MDBRow>
                <div
                  v-for="message in emailValMessages" 
                  v-if="emailValMessages!=='[]'" 
                  :class="[$style['error-message'], 'mb-4']"
                >
                  {{ message }}
                </div>
              </MDBRow>
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
              <MDBRow>
                <div
                  v-for="message in passwordValMessages" 
                  v-if="passwordValMessages!=='[]'" 
                  :class="[$style['error-message'], 'mb-4']"
                >
                  {{ message }}
                </div>
                <div v-if="passMatchErr" :class="[$style['error-message'], 'mb-4']">
                  {{ passMatchErr }}
                </div>
              </MDBRow>
              <MDBInput
                id="form2Phone"
                v-model.trim="phone"
                type="text"
                label="Phone Number"
                wrapper-class="mb-4"
                :maxlength="15"
                required
              />
              <MDBRow>
                <div
                  v-for="message in phoneValMessages" 
                  v-if="phoneValMessages!=='[]'" 
                  :class="[$style['error-message'], 'mb-4']"
                >
                  {{ message }}
                </div>
              </MDBRow>
              <MDBInput
                id="form2AddressLineOne"
                v-model.trim="addressLineOne"
                type="text"
                label="Address line 1"
                wrapper-class="mb-4"
                :maxlength="35"
                required
              />
              <MDBRow>
              <div
                  v-for="message in addressLineOneValMessages" 
                  v-if="addressLineOneValMessages!=='[]'" 
                  :class="[$style['error-message'], 'mb-4']"
                >
                  {{ message }}
                </div>
              </MDBRow>
              <MDBInput
                id="form2AddressLineTwo"
                v-model.trim="addressLineTwo"
                type="text"
                label="Address line 2"
                wrapper-class="mb-4"
                :maxlength="35"
              />
              <MDBRow>
                <div
                  v-for="message in addressLineTwoValMessages" 
                  v-if="addressLineTwoValMessages!=='[]'" 
                  :class="[$style['error-message'], 'mb-4']"
                >
                  {{ message }}
                </div>
              </MDBRow>
              <MDBInput
                id="form2city"
                v-model.trim="city"
                type="text"
                label="Town / city"
                wrapper-class="mb-4"
                :maxlength="35"
              />
              <MDBRow>
                <div
                  v-for="message in cityValMessages" 
                  v-if="cityValMessages!=='[]'" 
                  :class="[$style['error-message'], 'mb-4']"
                >
                  {{ message }}
                </div>
              </MDBRow>
              <MDBInput
                id="form2postcode"
                v-model.trim="postcode"
                type="text"
                label="Postcode"
                wrapper-class="mb-4"
                :maxlength="8"
              />
              <MDBRow>
              <div
                  v-for="message in postcodeValMessages" 
                  v-if="postcodeValMessages!=='[]'" 
                  :class="[$style['error-message'], 'mb-4']"
                >
                  {{ message }}
                </div>
              </MDBRow>

              <MDBBtn type="submit" color="primary" :disabled="!canRegister">
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

      const firstNameValMessages = ref(null);
      const lastNameValMessages = ref(null);
      const emailValMessages = ref(null);
      const passwordValMessages = ref(null);
      const phoneValMessages = ref(null);
      const addressLineOneValMessages = ref(null);
      const addressLineTwoValMessages = ref(null);
      const cityValMessages = ref(null);
      const postcodeValMessages = ref(null);

      const validationErrors = ref([]);
      const inputsValid = ref(true);


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

      const validateInputs = () => {
        //inputsValid.value = true;
        checkPasswordsMatch();

        firstNameValMessages.value = validateName(firstName.value);
        lastNameValMessages.value = validateName(lastName.value);
        emailValMessages.value = validateEmail(email.value);
        passwordValMessages.value = validatePassword(password.value);
        phoneValMessages.value = validatePhoneNumber(phone.value);
        addressLineOneValMessages.value = validateAddressLineOne(addressLineOne.value);
        addressLineTwoValMessages.value = validateAddressLineTwo(addressLineTwo.value);
        cityValMessages.value = validateCity(addressLineOne.value);
        postcodeValMessages.value = validatePostcode(postcode.value);

        if (
          firstNameValMessages.value.length !== 0 ||
          lastNameValMessages.value.length !== 0 ||
          emailValMessages.value.length !== 0 ||
          passwordValMessages.value.length !== 0 ||
          phoneValMessages.value.length !== 0 ||
          addressLineOneValMessages.value.length !== 0 ||
          addressLineTwoValMessages.value.length !== 0 ||
          cityValMessages.value.length !== 0 ||
          postcodeValMessages.value.length !== 0 ||
          passMatchErr.value
        ) {
          validationErrors.value.push(
            firstNameValMessages.value,
            lastNameValMessages.value,
            emailValMessages.value,
            passwordValMessages.value,
            phoneValMessages.value,
            addressLineOneValMessages.value,
            addressLineTwoValMessages.value,
            cityValMessages.value,
            postcodeValMessages.value
          );
          inputsValid.value = false;}
        else{
          inputsValid.value = true;
        }
      };

      //submit registration data and create account
      const handleSubmit = async () => {
        // check all inputs are valid:
        validateInputs();
        if(!inputsValid.value) return;

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

      watch([addressLineOne, city, country, email, firstName, lastName, passConfirm, password, phone, postcode], () => {
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
               passConfirm, passMatchErr, password, phone, postcode, signupError, firstNameValMessages,
               lastNameValMessages,emailValMessages, passwordValMessages, phoneValMessages,
               addressLineOneValMessages, addressLineTwoValMessages,
               cityValMessages, postcodeValMessages, validationErrors, validateInputs, inputsValid };
    }
  };
</script>

<style lang="scss" scoped module>
  @import "../../assets/styles/Authentication.scss";
</style>
