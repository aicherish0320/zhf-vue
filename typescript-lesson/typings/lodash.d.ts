declare module 'lodash' // 声明一个模块

declare module '*.vue' {
  interface IVue {
    install: () => void
  }

  const Vue: IVue

  // export default Vue
  // 这个语法是 ts 中自带的，为了兼容 CJS
  export = Vue
}
