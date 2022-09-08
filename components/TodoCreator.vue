<template>
    <div>
        <!-- 추가 버튼 -->
        <button @click="createTodo">추가</button>
        <!-- todo 작성하는 곳 -->
        <input
        :value="title"
        :placeholder="placeholder"
        type="text"
        @input="title = $event.target.value"
        @keypress.enter="createTodo"
        />
    </div>
</template>

<script>
export default {
  data () {
    return {
      title: '',
      placeholder: '할 일을 추가하세요'
    }
  },
  methods: {
    createTodo () { // todo 하나 생성하는 메서드
      const validatedTitle = this.title && this.title.trim()
      if (!validatedTitle) {
        alert('유효하지 않은 제목입니다')
        this.title = this.title.trim()
        return
      }
      this.$emit('create-todo', this.title) // 부모 컴포넌트에게 특정 이벤트를 올려주는 것, 첫번째 인수는 올려지는 이벤트 이름, 두번째 인수는 같이 올릴 데이터
      this.title = ''
    }
  }
}
</script>
