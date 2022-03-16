/* @flow */

import config from "../config";
import { initUse } from "./use";
import { initMixin } from "./mixin";
import { initExtend } from "./extend";
import { initAssetRegisters } from "./assets";
import { set, del } from "../observer/index";
import { ASSET_TYPES } from "shared/constants";
import builtInComponents from "../components/index";
import { observe } from "core/observer/index";

import {
  warn,
  extend,
  nextTick,
  mergeOptions,
  defineReactive,
} from "../util/index";

export function initGlobalAPI(Vue: GlobalAPI) {
  // config
  const configDef = {};
  configDef.get = () => config;
  if (process.env.NODE_ENV !== "production") {
    configDef.set = () => {
      warn(
        "Do not replace the Vue.config object, set individual fields instead."
      );
    };
  }
  Object.defineProperty(Vue, "config", configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn,
    extend,
    mergeOptions,
    defineReactive,
  };

  // 给不存在的属性 添加成响应式 vm.$set({}, 'a', 100)
  Vue.set = set;
  Vue.delete = del;
  // 用了一个异步（同步执行完毕后才执行）任务，将多个方法维持一个队列里
  Vue.nextTick = nextTick;

  // 2.6 explicit observable API
  // 小型的vuex 把对象变成响应式的
  Vue.observable = <T>(obj: T): T => {
    observe(obj);
    return obj;
  };

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach((type) => {
    // Vue.components Vue.directives Vue.filters
    Vue.options[type + "s"] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;
  // Vue 实例上的变量 一般都是以 $ 开发 vm.$watch
  // Vue的私有方法 vm.$$
  // 增加 keep-alive 组件
  // </T>
  extend(Vue.options.components, builtInComponents);

  // Vue.use
  initUse(Vue);
  // 将属性合并到 Vue 的选项上
  initMixin(Vue);
  // Vue.extend
  initExtend(Vue);
  initAssetRegisters(Vue);
}
