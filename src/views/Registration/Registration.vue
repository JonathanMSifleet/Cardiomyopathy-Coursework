<template>
  <div class="login w-100 p-4 d-flex align-items-center justify-content-center" style="height: 70%">
    <MDBCard class="authentication-card" text="center">
      <MDBCardHeader>User Registration</MDBCardHeader>
      <MDBCardBody>
        <MDBCardTitle>
          <!--print any google auth errors-->
          <div v-if="signupError" class="error-message mb-4">{{ signupError }}</div>
          <div v-if="passMatchErr" class="error-message mb-4">{{ passMatchErr }}</div>
        </MDBCardTitle>
        <MDBCardText>
          <form @submit.prevent="handleSubmit">
            <MDBRow>
              <MDBCol md="6">
                <MDBInput
                  type="text"
                  label="First Name"
                  id="form2FirstName"
                  v-model="firstName"
                  wrapperClass="mb-4"
                  required
                />
              </MDBCol>
              <MDBCol md="6">
                <MDBInput
                  type="text"
                  label="Last Name"
                  id="form2LastName"
                  v-model="lastName"
                  wrapperClass="mb-4"
                  required
                />
              </MDBCol>
            </MDBRow>
            <MDBInput
              type="email"
              label="Email address"
              id="form2Email"
              v-model="email"
              wrapperClass="mb-4"
              required
            />
            <!-- Password input -->
            <MDBInput
              type="password"
              label="Password"
              id="form2Password"
              v-model="password"
              wrapperClass="mb-4"
              required
            />
            <MDBInput
              type="password"
              label="Confirm Password"
              id="form2Password"
              v-model="passConfirm"
              wrapperClass="mb-4"
              required
            />
            <MDBInput
              type="number"
              label="Phone Number"
              id="form2Phone"
              v-model="phone"
              wrapperClass="mb-4"
              required
            />
            <MDBInput
              type="text"
              label="Address"
              id="form2Address"
              v-model="address"
              wrapperClass="mb-4"
              required
            />

            <MDBBtn type="submit" color="primary">Register</MDBBtn>
          </form>
        </MDBCardText>
      </MDBCardBody>
      <MDBCardFooter>
        <!-- Register buttons -->
        <div class="text-center mt-3">
          <p>
            Already a member?
            <router-link :to="{ name: 'Login' }" class="register-link">Login here</router-link>
          </p>
        </div>
      </MDBCardFooter>
    </MDBCard>
  </div>
</template>

<script>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { auth, db} from '../firebase/config'
  import { sendEmailVerification, signOut, 
           updateProfile } from 'firebase/auth';
  import { doc, setDoc } from 'firebase/firestore'; 
  import useSignup from '../composables/useSignup';
  import getUser from '../composables/getUser';
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
      MDBCardFooter
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
      const passMatchErr = ref('');
      
      //in firebase firestore, create collection called users
      //change db rules to: write: if request.auth != null;
      //for this to work (if not in test mode)
      const addUserInfo = async (userObj) => {
        //create new user doc in user collection
        await setDoc(doc(db, 'users', userObj.uid), userObj);
      }
     
      //compare the 2 password inputs
      const passwordsMatch = () =>{
        if(
          password.value !== passConfirm.value &&
          password.value !== '' &&
          passConfirm.value !== ''
        ){
          passMatchErr.value = 'Your passwords do not match! ' +
            'Please try again.'
          return false;
        }
        else{
          passMatchErr.value = null;
          return true;
        }};
      
      //submit registration data and create account
      const handleSubmit = async ()=> {
        //exit function if password confirmation does not match
        if(!checkPasswordsMatch()) return;

        //create user acc
        await signup(email.value, password.value);
        
        if (!signupError.value){//success
          
          //send email for the user to verify email
          await sendEmailVerification(auth.currentUser);
          alert('Verification email sent.');
         
          //get currently signed in user
          const {currentUser} = getUser();
          
          //create user info object
          const user = {
            uid: currentUser.value.uid,
            firstName: firstName.value,
            lastName: lastName.value,
            address: address.value,
            email: email.value,
            phone: phone.value
          }
          //add user info to firestore db
          await addUserInfo(user);
          
          //set user display name
          updateProfile(auth.currentUser, {
            displayName: firstName.value
          }).catch((error) => {
            console.log(error);
          });

          //sign user out
          signOut(auth).then(() => {
            console.log('Signed Out');
          }).catch((error) => {
            console.log(error);
          });

          //redirect to login
          router.push('/');
        }
      }
      return {email, password, handleSubmit, signupError, 
              phone, address, firstName, lastName, passMatchErr, passConfirm};
    }
  };
</script>

<style>
  @import "../../assets/styles/Authentication.scss";
</style>
