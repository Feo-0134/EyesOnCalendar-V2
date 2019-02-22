import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        calendar: null,
        socket: null
    },
    mutations: {                               //必须同步执行
        setCalendar(state, data) {
            state.calendar = data
        },
        toggleDay(state, data) {
            //console.log("Something is wrong!")
            state.calendar.calendar[data.personkey].days[data.toggleevent.index].work = !data.toggleevent.item.work
            state.socket.emit('updateCalendar',state.calendar)
        }
    },
    actions: {                                 //可以异步
        toggleWork({commit,state},data) {
            commit('toggleDay',data)
        }
    }
})

export default store