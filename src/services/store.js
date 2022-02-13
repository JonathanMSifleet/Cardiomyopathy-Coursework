import initDatabase from '../utils/initDatabase';
import { reactive } from 'vue';

const store = reactive({
  database: (async () => await initDatabase())()
});

export default store;
