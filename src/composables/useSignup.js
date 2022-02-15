import { ref } from 'vue';
import 'regenerator-runtime/runtime';
//firebase
import { auth } from '../firebase/config'
import { createUserWithEmailAndPassword } from 'firebase/auth';
const signupError = ref(null);
const pending = ref(false);

//creates firebase user email/pass auth entry
const signup = async(email, password) => {
  signupError.value = null;
  pending.value = true;

  try{
    const res = await createUserWithEmailAndPassword(auth, email, password);
    if(!res){
      throw new Error('Sign Up Unsuccessful')
    }
    signupError.value = null;
    pending.value=false;
  }
  catch(err){
    console.log(err.message);
    signupError.value = err.message;
    pending.value = false;
  }
}

//composable function
const useSignup = ()=>{
  return {signup, signupError, pending}
}

export default useSignup;


