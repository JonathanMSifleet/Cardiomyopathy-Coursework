import { auth } from '../firebase/config';
import { ref } from 'vue';
import { sendPasswordResetEmail } from 'firebase/auth';

const error = ref(null);
const isPending = ref(false);

const passReset = async(email) => {
  error.value = null;
  isPending.value = true;

  try {
    await sendPasswordResetEmail(auth, email);
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
