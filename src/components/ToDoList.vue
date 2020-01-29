<template>
  <div class="container">
    <h1>My To Do List</h1>
    <p>The list currently contains {{todosCount}} To Dos.</p>
    <div>
      <input type="text" v-model="input">
      <button @click="addToDo">Add</button>
    </div>
    <ul v-show="todosCount > 0">
      <li v-for="todo in todos" :key="todo">{{todo}}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {Actions} from "@/store";

@Component
export default class ToDoList extends Vue {
  input: string = '';

  get todos(): string[] {
    return this.$vStore.state.todos;
  }

  get todosCount(): number {
    return this.$vStore.getters.todosCount;
  }

  addToDo() {
    this.$vStore.dispatch(Actions.AddTodo, this.input);
    this.input = '';
  }
}
</script>

<style scoped lang="scss">
$backgroundColor: lighten(#42b983, 40%);

.container {
  max-width: 350px;
  margin: 0 auto;
  background-color: $backgroundColor;
  padding: 5px;
}
ul {
  padding: 0;
}
li {
  display: block;

  &:nth-child(odd) {
    background-color: darken($backgroundColor, 10%);
  }
}
</style>
