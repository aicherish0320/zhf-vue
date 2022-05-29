// 声明文件 目的是让不支持 ts 的模块也有语法提示
// 默认先查找 package.json 中的 types 字段，如果没有提供 types 字段，会去查找 index.d.ts
// 当前代码会自动去查找 node_modules 下 @types 下的文件，默认会去查找 index.d.ts

import lodash from 'lodash'

import Vue from './App.vue'

// Vue.install

declare const world: string // declare 只声明文件 不实现

const person: IPerson = {
  fullName: 'aicherish'
}

export {}
