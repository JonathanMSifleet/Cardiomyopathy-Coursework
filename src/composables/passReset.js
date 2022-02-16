import { auth } from '../firebase/config.js';
import { sendPasswordResetEmail } from 'firebase/auth';
import { ref } from 'vue';
// import 'regenerator-runtime/runtime'; //needed for async

const error = ref(null);
const isPending = ref(false);

const passReset = async(email) => {
  error.value = null;
  isPending.value = true;
  try{
    await sendPasswordResetEmail(auth, email);
    isPending.value = false;
  }
  catch(err){
    console.log(err.message);
    error.value = err.message;
    isPending.value = false;
  }
};
//composable function
const usePassReset = ()=>{
  return {passReset, error, isPending};
};

export default usePassReset;
