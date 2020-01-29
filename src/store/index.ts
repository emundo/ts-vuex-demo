import Vue, {PluginObject} from 'vue';
import Vuex, {ActionContext, Store} from 'vuex';

interface State {
  todos: string[]
}

interface Getters {
  todosCount: number;
}

type GettersDefinition = {
  [P in keyof Getters]: (state: State, getters: Getters) => Getters[P];
}

interface MyStore extends Store<State> {
  getters: Getters;
}

declare module "vue/types/vue" {
  interface Vue {
    $vStore: MyStore;
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

const getters: GettersDefinition = {
  todosCount: state => state.todos.length
};

export default new Store<State>({
  state: {
    todos: []
  },
  getters: getters,
  mutations: {
    ADD_TODO: (state: State, payload: string) => state.todos.push(payload)
  },
  actions: {
    ADD_TODO: (injectee: ActionContext<State, State>, payload: string) => injectee.commit("ADD_TODO", payload)
  }
});
