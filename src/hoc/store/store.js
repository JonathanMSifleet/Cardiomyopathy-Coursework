import Vuex from 'vuex';
import 'firebase/auth';
import getUser from '../../composables/getUser.js';

export default new Vuex.Store({
  state: {
    user: null,
    accountEmail: null,
    accountFirstName: null,
    accountLastName: null,
    accountId: null,
    accountInitials: null
  },
  mutations: {
    setAccountInfo(state, payload){
      state.accountId = payload.id;
      state.accountEmail = payload.data().email;
      state.accountFirstName = payload.data().firstName;
      state.accountLastName = payload.data().lastName;
    },
    updateUser(state, payload){
      state.user = payload;
    },
    setAccountInitials(state){
      state.accountInitials =
      state.accountFirstName.match(/\b(\S)/g) +
      state.accountLastName.match(/\b(\S)/g);
    }
  },
  actions: {
    async getCurrentUser({commit}) {
      const dbResults = await getUser();
      // const dbResults = await dataBase.get();
      commit('setAccountInfo', dbResults);
      commit('setAccountInitials');
      console.log(dbResults);
    }
  },
  modules: {}
});
