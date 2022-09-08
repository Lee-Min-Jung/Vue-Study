<template>
    <div class="todo-app">
      <div class="todo-app_actions">
      <!-- todo 필터 항목들 -->
        <div class="filters">
          <button
          :class="{ active: filter === 'all'}"
          @click="changeFilter('all')">
            모든 항목 ({{total}})
          </button>
          <button
          :class="{ active: filter === 'active'}"
          @click="changeFilter('active')">
            해야 할 항목 ({{activeCount}})
          </button>
          <button
          :class="{ active: filter === 'completed'}"
          @click="changeFilter('completed')">
            완료된 항목 ({{completedCount}})
          </button>
        </div>
      </div>
      <div class="todo-app__list">
        <!-- todo-item컴포넌트 -->
        <todo-item
          v-for="todo in filteredTodos"
          :key="todo.id"
          :todo="todo"
          @update-todo="updateTodo"
          @delete-todo="deleteTodo"
        />
      </div>
        <hr/>
      <!-- todo-creator 컴포넌트 -->
        <todo-creator
        class="todo-app__creator"
        @create-todo="createTodo"/> <!-- 자식이 보낸 이벤트 이름(왼), 여기서 작성한 메서드 이름(오) -->
    </div>
</template>

<script>

import lowdb from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'
import cryptoRandomString from 'crypto-random-string'
import _cloneDeep from 'lodash/cloneDeep' // 현재 프로젝트는 클라이언트 혼자 다 하니 받아온 Db 그대로 쓰면 그대로 반영되어서 복사 DB 필요
import _find from 'lodash/find'
import _assign from 'lodash/assign'
import _findIndex from 'lodash/findIndex'
import TodoCreator from './TodoCreator'
import TodoItem from './TodoItem'

export default {
  components: {
    TodoCreator,
    TodoItem
  },
  data () {
    return {
      db: null,
      todos: [],
      filter: 'all'
    }
  },
  computed: {
    filteredTodos () {
      switch (this.filter) {
        case 'all':
        default:
          return this.todos
        case 'active':
          return this.todos.filter(todo => !todo.done)
        case 'completed':
          return this.todos.filter(todo => todo.done)
      }
    },
    total () {
      return this.todos.length
    },
    activeCount () {
      return this.todos.filter(todo => !todo.done).length
    },
    completedCount () {
      return this.total - this.activeCount
    }
  },
  created () {
    this.initDB()
  },
  methods: {
    initDB () { // 로컬 스토리지 사용 위한 코드, 로컬 디비 초기화 하는 코드
      const adapter = new LocalStorage('todo-app') // todo-app이라는 어댑터를 생성
      this.db = lowdb(adapter)

      console.log(this.db)

      const hasTodos = this.db.has('todos').value()

      if (hasTodos) { // DB에 데이터 있을 경우
        this.todos = _cloneDeep(this.db.getState().todos)
      } else { // DB에 데이터 없을 경우
        // 로컬 DB 초기화하는 부분
        this.db
          .defaults({
            todos: []
          })
          .write()
      }
    },
    createTodo (title) { // todo 하나 생성
      const newTodo = { // DB에 todo 생성
        id: cryptoRandomString({ length: 10 }),
        title,
        createdAt: new Date(),
        updatedAt: new Date(),
        done: false
      }
      this.db
        .get('todos')
        .push(newTodo)
        .write()

      this.todos.push(newTodo) // 화면에 보이는 곳에 todo 나오도록
    },
    updateTodo (todo, value) { // todo 업데이트
      this.db
        .get('todos')
        .find({ id: todo.id })
        .assign(value)
        .write()

      const foundTodo = _find(this.todos, { id: todo.id })
      _assign(foundTodo, value) // 화면에 나오게 하는 코드 근데 이걸 하면 왜 반영이 되는 거지..?
    },
    deleteTodo (todo) { // todo 삭제
      this.db
        .get('todos')
        .remove({ id: todo.id })
        .write()
      const foundIndex = _findIndex(this.todos, { id: todo.id }) // 화면에 안 보이게 하는 코드
      this.$delete(this.todos, foundIndex)
    },
    changeFilter (filter) { // 필터 항목을 바꾸는 메서드
      this.filter = filter
    }
  }
}
</script>
<style scoped lang="scss">
  button.active {
    font-weight: bold
  }
</style>
