const path = require('path') // 노드 자체에서 path로 경로를 가져온다
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const merge = require('webpack-merge')

require('@babel/polyfill')

// 개발용 배포용 나누어 적용하기 위한 코드
module.exports = (env, opts) => {
  const config = {

    resolve: {
      extensions: ['.vue', '.js'] // vue파일과 js파일의 확장자를 생략해서 쓸 거라고 명시
    },
    // 진입점, 가장 먼저 실행될 파일을 지정해야 함
    entry: {
      app: [
        '@babel/polyfill',
        path.join(__dirname, 'main.js')

      ] // dirname은 현재 파일의 경로 알려주는 노드 측의 전역 변수
    },
    // 결과물에 대한 설정
    output: {
      filename: '[name].js', // 이렇게 하면 진입점 별칭이 그대로 name에 들어가
      path: path.join(__dirname, 'dist') // dist는 디렉토리 이름
    },
    // 웹팩 처리 과정에 들어감, 뷰라는 확장자 만났을 때 뷰 로더 돌려달라고 하고 js확장자 만났을 때는 어떤 거 돌려주세요 이런 거 설정, webpack이 결과를 내기 위해 처리해야하는 수많은 모듈 처리 방식 명시
    module: {
      rules: [

        {
          test: /\.vue$/, // vue로 끝나는 파일을
          loader: 'vue-loader' // vue전체 파일 해석하는 로더, 위에 지정한 파일을 해석하겠다
        },
        {
          test: /\.js$/, // 이걸로 끝나는 파일을
          exclude: /node_modules/,
          loader: 'babel-loader'// 이걸로 해석하겠다
        },
        {
          test: /\.css$/,
          use: [
            'vue-style-loader',
            'css-loader',
            'postcss-loader'
          ]
        },
        {
          test: /\.scss$/,
          use: [
            'vue-style-loader',
            'css-loader',
            'postcss-loader',
            'sass-loader'
          ]
        }
      ]
    },
    // 웹팩 처리 과정에 들어감, 모듈 처리 후 추가로 어떤 작업 진행해야 하는지 명시
    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'index.html') // htmlwebpack플러그인이 index파일을 찾아 나중에 dist디렉터리에 넣어줄 것
      }),
      new CopyPlugin([ // 특정한 디렉터리나 파일을 카피해서 어디로 넣어줄 수 있는 역할 수행
        {
          from: 'assets/', // assets 폴더에 있는 모든 파일을 복사해서 to 경로로 넣어준다. 비워 놓으면 output경로이다
          to: ''
        }
      ])
    ]
  }

  if (opts.mode === 'development') { // 개발용
    return merge(config, {
      devtool: 'eval', // 빌드 시간 최소화하고 디버깅 가능하도록 하면서 폴더를 생성, 근데 파일 용량이 커진다, 실제 배포용 보다는 개발용으로 적합
      devServer: {
        open: false,
        hot: true
      }
    })
  } else { // 배포용
    return merge(config, {
      devtool: 'cheap-module-source-map', // cheap-module-source-map은 용량 작고 최적화 잘 되어 있고 빌드 시간 길고 디버깅 안 되어서 배포할 때 좋음

      plugins: [
        new CleanWebpackPlugin()
      ]
    })
  }
}
