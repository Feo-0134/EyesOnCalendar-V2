/* eslint-disable no-param-reassign */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    calendar: null,
    socket: null,
    displayName: null,
    admin: false,
  },
  mutations: { // 必须同步执行
    setUserInfo(state, data) {
      state.displayName = data.displayName;
      state.admin = data.admin;
      // console.log(state)
    },
    setCalendar(state, data) {
      state.calendar = data;
    },
    toggleDay(state, data) {
      // console.log("Something is wrong!")
      state.calendar.calendar[data.personkey].days[data.toggleevent.index].work = !data.toggleevent.item.work;
      state.socket.emit('updateCalendar', state.calendar);
    },
  },
  actions: { // 可以异步
    toggleWork({ commit }, data) {
      commit('toggleDay', data);
    },
  },
});

export default store;
