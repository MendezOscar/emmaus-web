import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _b9cb528e = () => interopDefault(import('../pages/course-asing.vue' /* webpackChunkName: "pages/course-asing" */))
const _7404ff8d = () => interopDefault(import('../pages/courses.vue' /* webpackChunkName: "pages/courses" */))
const _0937edaf = () => interopDefault(import('../pages/inspire.vue' /* webpackChunkName: "pages/inspire" */))
const _4ffea21b = () => interopDefault(import('../pages/revisor-register.vue' /* webpackChunkName: "pages/revisor-register" */))
const _7feb4a3e = () => interopDefault(import('../pages/revisors.vue' /* webpackChunkName: "pages/revisors" */))
const _cba0078c = () => interopDefault(import('../pages/section.vue' /* webpackChunkName: "pages/section" */))
const _40d3ab9d = () => interopDefault(import('../pages/section-asing.vue' /* webpackChunkName: "pages/section-asing" */))
const _addd65a2 = () => interopDefault(import('../pages/section-details.vue' /* webpackChunkName: "pages/section-details" */))
const _f0d262da = () => interopDefault(import('../pages/students.vue' /* webpackChunkName: "pages/students" */))
const _3b6eed1d = () => interopDefault(import('../pages/users.vue' /* webpackChunkName: "pages/users" */))
const _13f5da32 = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/course-asing",
    component: _b9cb528e,
    name: "course-asing"
  }, {
    path: "/courses",
    component: _7404ff8d,
    name: "courses"
  }, {
    path: "/inspire",
    component: _0937edaf,
    name: "inspire"
  }, {
    path: "/revisor-register",
    component: _4ffea21b,
    name: "revisor-register"
  }, {
    path: "/revisors",
    component: _7feb4a3e,
    name: "revisors"
  }, {
    path: "/section",
    component: _cba0078c,
    name: "section"
  }, {
    path: "/section-asing",
    component: _40d3ab9d,
    name: "section-asing"
  }, {
    path: "/section-details",
    component: _addd65a2,
    name: "section-details"
  }, {
    path: "/students",
    component: _f0d262da,
    name: "students"
  }, {
    path: "/users",
    component: _3b6eed1d,
    name: "users"
  }, {
    path: "/",
    component: _13f5da32,
    name: "index"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
