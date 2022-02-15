<template>
  <div class="register">
    <form class="register" @submit.prevent="handleSubmit">
      <h2>User Registration</h2>
      <input 
        type="email" 
        placeholder="Email Address"
        v-model="email"
        required
      >
      <input
        type="password"
        v-model="password"
        placeholder="Password"
        required
      >
      <input
        type="password"
        v-model="passConfirm"
        placeholder="Confirm Password"
        required
      >
      <br>
      <input
        type="text"
        v-model="firstName"
        placeholder="First Name"
        required
      >
      <input
        type="text"
        v-model="lastName"
        placeholder="Last Name"
        required
      >
      <br>
      <input
        type="number"
        v-model="phone"
        placeholder="Phone Number"
        required
      >
      <input
        type="text"
        v-model="address"
        placeholder="Address"
        required
      >
      <br>
      <button>Register</button>
    </form>
    {{name}}
    <!--print any google auth errors-->
    <div v-if="signupError">{{signupError}}</div>
    <div v-if="passMatchErr">{{passMatchErr}}</div>
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
  

  export default {
    name: 'Register',
    setup(){
      const router = useRouter();
      const email = ref('');
      const password = ref('');
      const passConfirm = ref('');
      const firstName = ref('');
      const lastName = ref('');
      const phone = ref('');
      const address = ref('');
      const { signupError, signup } = useSignup();
      const passMatchErr = ref('');
      
      //in firebase firestore, create collection called users
      //change db rules to: write: if request.auth != null;
      //for this to work (if not in test mode)
      const addUserInfo = async (userObj) =>{
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
        if(passwordsMatch() == false){
          return;
        }
        //create user acc
        await signup(email.value, password.value);
        
        if (!signupError.value){//success
          
          //send email for the user to verify email
          await sendEmailVerification(auth.currentUser);
          alert('Verification email sent.');
         
          //get currently signed in user
          const {currentUser} = getUser();
          
          //create user info object
          let user = {
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
          })
            .catch((error) => {
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
