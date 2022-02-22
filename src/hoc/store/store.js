import Vuex from 'vuex';
import 'firebase/auth';
import { auth } from '../../firebase/config.js';

export default new Vuex.Store({
  state: {
    user: null,
    accountEmail: null,
    accountFirstName: null,
    accountLastName: null,
    accountId: null
  },
  mutations: {
    setAccountInfo(state, payload){
      state.accountId = payload.getIdToken;
      state.accountEmail = payload.email;
      state.accountFirstName = payload.firstName;
      state.accountLastName = payload.lastName;
    },
    updateUser(state, payload){
      state.user = payload;
    }
  },
  actions: {
    async getCurrentUser({commit}) {
      let dbResults = auth.currentUser;
      // console.log(dbResults);
      commit('setAccountInfo', dbResults);
    }
  },
  modules: {}
});
