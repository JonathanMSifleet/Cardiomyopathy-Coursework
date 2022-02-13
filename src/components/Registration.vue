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
        type="number"
        v-model="phone"
        placeholder="Phone Number"
        required
      >
      <input
        type="text"
        v-model="name"
        placeholder="Name"
        required
      >
      <input
        type="text"
        v-model="address"
        placeholder="Address"
        required
      >
      <button>Register</button>
    </form>
    <!--print any google auth errors-->
    <div v-if="error">{{error}}</div>
  </div>
</template>

<script>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import useSignup from '../composables/useSignup';
  import {auth} from '../firebase/config'
  import {sendEmailVerification} from 'firebase/auth';
  import { doc, setDoc } from 'firebase/firestore'; 
  import {db} from '../firebase/config'

  export default {
    name: 'Register',
    setup(){
      const name = ref('');
      const email = ref('');
      const password = ref('');
      const phone = ref('');
      const address = ref('');
      const {error, signup} = useSignup();
      const router = useRouter();
      
      //in firebase firestore, create collection called users
      //change db rules to: write: if request.auth != null;
      //for this to work
      const addUserInfo = async (userObj) =>{
        await setDoc(doc(db, 'users', userObj.uid), userObj);
      }
     
      const handleSubmit = async ()=> {
        await signup(email.value, password.value);
        if (!error.value){//success
          console.log(auth.currentUser);
          //send an email for the user to verify email
          await sendEmailVerification(auth.currentUser);
          alert('Verifcation email sent.');
          const currentUser = auth.currentUser;
          //create user info object
          let user = {
            uid: currentUser.uid,
            name: name.value,
            address: address.value,
            email: email.value,
            phone: phone.value
          }
          //add user info to firestore db
          addUserInfo(user);

          router.push('/')//homepage
        }
      }
      return {email, password, handleSubmit, error, phone, address};
    }
  };
</script>
