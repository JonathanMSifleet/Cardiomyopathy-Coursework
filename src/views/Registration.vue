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

  export default {
    name: 'Register',
    setup(){
      const email = ref('');
      const password = ref('');
      const {error, signup} = useSignup();
      const router = useRouter();
      
      const handleSubmit = async ()=> {
        await signup(email.value, password.value);
        if (!error.value){//success
          router.push('/')//homepage
        }
      }
      return {email, password, handleSubmit, error};
    }
  };
</script>
