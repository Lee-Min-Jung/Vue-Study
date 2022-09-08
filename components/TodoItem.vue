<template>
    <div
    :class="{done}"
    class="todo-item">
        <!-- 수정모드 -->
      <div
        v-if="isEditMode"
        class="item__inner item--edit">    <!-- ref를 통해 해당 요소를 참조할 수 있도록 만든다. -->
            <!-- 수정하는 내용 작성하는 곳 -->
        <input
           ref="titleInput"
          :value="editedTitle"
          type="text"
          @input="editedTitle = $event.target.value"
          @keypress.enter="editedTodo"
          @keypress.esc="offEditMode">
            <!-- 수정완료버튼과 수정취소버튼 -->
        <div class="item__actions">
            <button
              key="complete"
              @click="editedTodo">완료</button>
            <button
              key="cancel"
              @click="offEditMode">취소</button>
        </div>
      </div>
      <!-- 일반모드 -->
      <div
        v-else
        class="item__inner item--normal">
            <!-- 체크박스 -->
        <input
        v-model="done"
        type="checkbox"
        />
            <!-- todo내용과 날짜 -->
          <div class="item__title-wrap">
             <div class="item__title">
                {{ todo.title }}
             </div>
          </div>
          <div class="item__date">
                   {{ date }}
          </div>
            <!-- todo 수정버튼과 삭제 버튼 -->
          <div class="item__actions">
             <button
               key="update"
               @click="onEditMode">수정</button>
             <button
               key="delete"
               @click="deleteTodo">삭제</button>                <!-- 같은 위치에 같은 버튼 있으면 다른 버튼인데도 같은 것처럼 인식되는 오류 발생 가능. 이걸 방지하기 위해 key 사용 -->
          </div>
      </div>
    </div>
</template>
<script>
import dayjs from 'dayjs'
export default {
  props: { // 부모에 있는 걸 자식에게 넘겨주는 것, todoApp의 div안에 있는 todoitem 태그에서 받은 todo를 넘겨 주는 것
    todo: Object
  },
  data () {
    return {
      isEditMode: false,
      editedTitle: ''
    }
  },
  computed: {
    done: {
      get () {
        return this.todo.done
      },
      set (done) {
        this.updateTodo({
          done
        })
      }
    },
    date () {
      const date = dayjs(this.todo.createdAt)
      const isSame = date.isSame(this.todo.updatedAt)
      if (isSame) {
        return date.format('YYYY년 MM월 DD일')
      } else {
        return `${date.format('YYYY년 MM월 DD일')} (edited)`
      }
    }
  },
  methods: {
    editedTodo () { // 수정 후 완료 버튼 눌렀을 때
      if (this.todo.title !== this.editedTitle) { // 수정이 실제로 이루어진 경우
        this.updateTodo({
          title: this.editedTitle,
          updatedAt: new Date()
        })
      }
      this.offEditMode()
    },
    onEditMode () { // 수정모드로 들어가기
      this.isEditMode = true
      this.editedTitle = this.todo.title

      this.$nextTick(() => { // 위에 있는 걸 실행하고 난 이후 바로 이 부분을 실행하겠다
        this.$refs.titleInput.focus()
      })
    },
    offEditMode () { // 수정모드 끄기
      this.isEditMode = false
    },
    updateTodo (value) { // 수정하기
      this.$emit('update-todo', this.todo, value)
    },
    deleteTodo () { // 삭제하기
      this.$emit('delete-todo', this.todo)
    }
  }
}
</script>
<style scoped lang="scss">
   .todo-item { //전체 div에 적용
    margin-bottom: 15px; //div끼리의 간격...
     .item__inner { // 각 todo 안에 있는 item끼리의 배치에 대해
        display: flex;
     }
     .item__date { //date 글자 크기
         font-size: 12px;
     }
     &.done { // done이 true이면 title에 선 긋기
        .item__title {
            text-decoration: line-through;
        }
     }
   }
</style>
