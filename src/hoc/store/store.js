import Vuex from 'vuex';
import 'firebase/auth';
import { auth } from '../../firebase/config.js';

export default new Vuex.Store({
  state: {
    user: null,
    accountEmail: null,
    accountDisplayName: null,
    accountId: null
  },
  mutations: {
    setAccountInfo(state, payload){
      state.accountId = payload.getIdToken;
      state.accountEmail = payload.email;
      state.accountDisplayName = payload.displayName;
    },
    updateUser(state, payload){
      state.user = payload;
    }
  },
  actions: {
    async getCurrentUser({commit}) {
      let dbResults = auth.currentUser;
      console.log(dbResults);
      commit('setAccountInfo', dbResults);
    }
  },
  modules: {}
});
