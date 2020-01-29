import Vue, {PluginObject} from 'vue';
import Vuex, {ActionContext, Store} from 'vuex';

interface State {
  todos: string[]
}

declare module "vue/types/vue" {
  interface Vue {
    $vStore: Store<State>;
  }
}

const typedStorePlugin: PluginObject<void> = {
  install(VueInstance: typeof Vue) {
    Object.defineProperty(VueInstance.prototype, '$vStore', {
        get() {
          return this.$store;
        }
    });
  }
};

Vue.use(Vuex);
Vue.use(typedStorePlugin);

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
