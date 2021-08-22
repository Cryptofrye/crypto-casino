import Notiflix from "notiflix";
import Vue from 'vue'

export default (ctx, inject) => {
  const notiflix = Notiflix
  Vue.prototype.$notiflix = notiflix
  ctx.$notiflix = notiflix
  inject('notiflix', notiflix)
}
