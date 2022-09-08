module.exports = {
    root: true,
    parserOptions: {
        parser: 'babel-eslint',
        ecmaVersion: 2015,
        sourceType: 'module'
    },
    env: {
        browser: true,
        node: true
    },
    extends: [
        'standard',
        'plugin:vue/essential'
    ],
    plugins: [
        'vue'
    ],
    rules: { //예외 규칙 적는 곳
        'no-new':0 //0은 에러 발생시키지 않겠다는 것, 1은 에러 발생시키는 것, 2는 경고 나오게 하는 것
    }
}