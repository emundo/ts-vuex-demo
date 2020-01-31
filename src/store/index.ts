import Vue, {PluginObject} from 'vue';
import Vuex, {Action, ActionContext, CommitOptions, DispatchOptions, Mutation, Store} from 'vuex';

interface State {
  todos: string[]
}

interface Getters {
  todosCount: number;
}

type GettersDefinition = {
  [P in keyof Getters]: (state: State, getters: Getters) => Getters[P];
}

export enum Mutations {
  AddTodo="ADD_TODO"
}

type MutationsDefinition = {
  [P in Mutations]: Mutation<State>;
}

interface BaseMutationPayloadWithType {
  type: Mutations;
}

export interface MyCommit {
  (type: Mutations, payload?: any, options?: CommitOptions): void;
  <P extends BaseMutationPayloadWithType>(payloadWithType: P, options?: CommitOptions): void;
}

class ActionFacade {
  constructor(private readonly store: MyStore) {
  }
  addTodo(todo: string) {
    return this.store.dispatch('addTodo', todo);
  }

}

type PayloadType<T> = T extends (payload: infer U) => any ? U : never;

type ActionsDefinition = {
  [P in keyof ActionFacade]: (this: Store<State>, injectee: ActionContext<State, State>, payload: PayloadType<ActionFacade[P]>) => Promise<void> | void;
}

interface MyStore extends Store<State> {
  getters: Getters;
  commit: MyCommit;
  actions: ActionFacade;
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

const mutations: MutationsDefinition = {
  [Mutations.AddTodo]: (state: State, payload: string) => state.todos.push(payload)
};

const actions: ActionsDefinition = {
  addTodo: (injectee: ActionContext<State, State>, payload: string) => injectee.commit("ADD_TODO", payload)
};

const store = new Store<State>({
  state: {
    todos: []
  },
  getters: getters,
  mutations: mutations,
  actions: actions
}) as MyStore;
store.actions = new ActionFacade(store);

export default store;
