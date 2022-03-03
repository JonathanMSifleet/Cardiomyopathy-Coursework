import { auth } from '../firebase/config';
import { sendPasswordResetEmail } from 'firebase/auth';
import { ref } from 'vue';

const error = ref(null);
const isPending = ref(false);
//povides url to continue to after clicking on verif link
const actionCodeSettings = {
  //change to domain address of production site
  url: 'http://localhost:8080/'
};

const passReset = async(email) => {
  error.value = null;
  isPending.value = true;

  try {
    await sendPasswordResetEmail(auth, email, actionCodeSettings);
    isPending.value = false;
  } catch (err) {
    console.error(err.message);
    error.value = err.message;
    isPending.value = false;
  }
};
//composable function
const usePassReset = () => {
  return { passReset, error, isPending };
};

export default usePassReset;
