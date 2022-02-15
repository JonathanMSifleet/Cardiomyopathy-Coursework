<template>
  <div class='resetForm'>
    <form @submit.prevent="handleSubmit">
      <h2>Reset Password:</h2>
      <input type="email" v-model="email" required>
      <button>Send reset email</button>    
    </form>
    <!--print any google auth errors-->
    <div v-if="error">{{error}}</div>
  </div>
</template>

<script>
  import { ref } from 'vue';
  import usePassReset from '../composables/passReset';

  export default {
    name: 'PassReset',
    setup(){
      const email = ref('');
      const {error, passReset} = usePassReset();
      
      const handleSubmit = async ()=> {
        //attempt to send reset email
        await passReset(email.value);
        if (!error.value){//success
          alert('Password reset email sent');
        }
      }
      return {email, handleSubmit, error};
    }
  };
</script>
