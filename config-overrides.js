const {
  override,
  fixBabelImports,
  addLessLoader,
  addDecoratorsLegacy,
  addWebpackAlias
} = require('customize-cra');

const { resolve } = require('path')
module.exports = override(
  // 按需加载
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true
  }),
  // 自定义主题
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      '@primary-color': '#1DA57A'
    }
  }),
  // ES7 装饰器语法兼容
  // @babel/plugin-proposal-decorators
  addDecoratorsLegacy(),
  // 配置webpack路径别名
  addWebpackAlias({
    '$api': resolve(__dirname, './src/api'),
    '$comp':resolve(__dirname,'./src/components'),
    '$conf':resolve(__dirname,'./src/config'),
    '$cont':resolve(__dirname,'./src/containers'),
    '$redux':resolve(__dirname,'./src/redux'),
    '$utils':resolve(__dirname,'./src/utils')
  })
);