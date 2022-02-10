import {ref} from 'vue';
import 'regenerator-runtime/runtime';

//firebase
import {auth} from '../firebase/config'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import 'regenerator-runtime/runtime';//needed for async 
const error =ref(null);
const isPending = ref(false);

const signup = async(email, password) => {
  error.value=null;
  isPending.value = true;

  try{
    const res = await createUserWithEmailAndPassword(auth, email, password);
    if(!res){
      throw new Error('Sign Up Unsuccessful')
    }
    error.value = null;
    isPending.value=false;

  }
  catch(err){
    console.log(err.message);
    error.value = err.message;
    isPending.value = false;
  }
}

//composable function
const useSignup = ()=>{
  return {signup, error, isPending}
}

export default useSignup;


