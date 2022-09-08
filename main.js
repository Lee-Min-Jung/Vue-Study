import Vue from 'vue' // vue라는 모듈에서 가져와 Vue라는 변수로 사용할 것이다
import App from './App' // 작성한 App.vue 파일을 가져와 연결

new Vue({
  el: '#app',
  render (createElement) { // render를 통해 App.vue를 연결시킬 수 있다
    // createElement는 callback 함수이다.
    return createElement(App) // 매개변수로 최상위 컴포넌트 줘서 생성함
  }
  // render: h => h(App) 위 표현과 같음
})
