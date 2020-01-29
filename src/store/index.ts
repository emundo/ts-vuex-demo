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

export enum Actions {
  AddTodo="ADD_TODO"
}

type ActionsDefinition = {
  [P in Actions]: Action<State, State>;
}

interface BaseActionPayloadWithType {
  type: Actions;
}

export interface MyDispatch {
  (type: Actions, payload?: any, options?: DispatchOptions): Promise<any>;
  <P extends BaseActionPayloadWithType>(payloadWithType: P, options?: DispatchOptions): Promise<any>;
}

interface MyStore extends Store<State> {
  getters: Getters;
  commit: MyCommit;
  dispatch: MyDispatch;
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
  [Actions.AddTodo]: (injectee: ActionContext<State, State>, payload: string) => injectee.commit("ADD_TODO", payload)
};

export default new Store<State>({
  state: {
    todos: []
  },
  getters: getters,
  mutations: mutations,
  actions: actions
});
