import Vue from 'vue';
import Vuex, {ActionContext, Store} from 'vuex';

interface State {
  todos: string[]
}

Vue.use(Vuex);

export default new Store<State>({
  state: {
    todos: []
  },
  getters: {
    todosCount: state => state.todos.length
  },
  mutations: {
    ADD_TODO: (state: State, payload: string) => state.todos.push(payload)
  },
  actions: {
    ADD_TODO: (injectee: ActionContext<State, State>, payload: string) => injectee.commit("ADD_TODO", payload)
  }
});