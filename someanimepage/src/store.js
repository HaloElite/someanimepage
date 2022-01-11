import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import { cloneDeep } from 'lodash';

// Create a new store instance.
const store = createStore({
  plugins: [createPersistedState()],
  state () {
    return {
      result: [],
      filteredResult: [],
      filteredSUbResult: [],
      currentGenre: [],
      disableFilter: false,
    }
  },
  getters: {
    getres (state) {
      return state.result;
    },
    getfilteredres (state) {
      return state.filteredResult;
    },
    getfilteredSubres (state) {
      return state.filteredSUbResult;
    },
    getgenre (state) {
      return state.currentGenre;
    },
    getdisablefilter (state) {
      return state.disableFilter;
    }
  },
  mutations: {
    SET_RES (state, data) {
      state.result = cloneDeep(data);
    },
    SET_FILTERED_RES (state, data) {
      state.filteredResult = cloneDeep(data);
    },
    SET_FILTERED_SUB_RES (state, data) {
      state.filteredSUbResult = cloneDeep(data);
    },
    SET_GENRE (state, data) {
      state.currentGenre.push(data);
    },
    RESET_GENRE(state) {
      state.currentGenre.length = 0;
      // state.currentGenre = [];
    },
    SET_DISABLEFILTER(state, data) {
      state.disableFilter = data;
    }
  }
});

export default store;