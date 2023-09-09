import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _e751ac06 = () => interopDefault(import('../pages/courses.vue' /* webpackChunkName: "pages/courses" */))
const _218a181f = () => interopDefault(import('../pages/inspire.vue' /* webpackChunkName: "pages/inspire" */))
const _8ec3f200 = () => interopDefault(import('../pages/lessons.vue' /* webpackChunkName: "pages/lessons" */))
const _bbae39ee = () => interopDefault(import('../pages/level.vue' /* webpackChunkName: "pages/level" */))
const _655e29b7 = () => interopDefault(import('../pages/module.vue' /* webpackChunkName: "pages/module" */))
const _56689558 = () => interopDefault(import('../pages/request.vue' /* webpackChunkName: "pages/request" */))
const _6f52d362 = () => interopDefault(import('../pages/requests.vue' /* webpackChunkName: "pages/requests" */))
const _40eae8ad = () => interopDefault(import('../pages/revisor-view.vue' /* webpackChunkName: "pages/revisor-view" */))
const _71de6dce = () => interopDefault(import('../pages/revisors.vue' /* webpackChunkName: "pages/revisors" */))
const _9afbb2ac = () => interopDefault(import('../pages/section.vue' /* webpackChunkName: "pages/section" */))
const _3e18420d = () => interopDefault(import('../pages/section-asing.vue' /* webpackChunkName: "pages/section-asing" */))
const _678a079f = () => interopDefault(import('../pages/section-details.vue' /* webpackChunkName: "pages/section-details" */))
const _7989f223 = () => interopDefault(import('../pages/students.vue' /* webpackChunkName: "pages/students" */))
const _3c2b553f = () => interopDefault(import('../pages/students-view.vue' /* webpackChunkName: "pages/students-view" */))
const _1a28f38d = () => interopDefault(import('../pages/users.vue' /* webpackChunkName: "pages/users" */))
const _5681cd52 = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/courses",
    component: _e751ac06,
    name: "courses"
  }, {
    path: "/inspire",
    component: _218a181f,
    name: "inspire"
  }, {
    path: "/lessons",
    component: _8ec3f200,
    name: "lessons"
  }, {
    path: "/level",
    component: _bbae39ee,
    name: "level"
  }, {
    path: "/module",
    component: _655e29b7,
    name: "module"
  }, {
    path: "/request",
    component: _56689558,
    name: "request"
  }, {
    path: "/requests",
    component: _6f52d362,
    name: "requests"
  }, {
    path: "/revisor-view",
    component: _40eae8ad,
    name: "revisor-view"
  }, {
    path: "/revisors",
    component: _71de6dce,
    name: "revisors"
  }, {
    path: "/section",
    component: _9afbb2ac,
    name: "section"
  }, {
    path: "/section-asing",
    component: _3e18420d,
    name: "section-asing"
  }, {
    path: "/section-details",
    component: _678a079f,
    name: "section-details"
  }, {
    path: "/students",
    component: _7989f223,
    name: "students"
  }, {
    path: "/students-view",
    component: _3c2b553f,
    name: "students-view"
  }, {
    path: "/users",
    component: _1a28f38d,
    name: "users"
  }, {
    path: "/",
    component: _5681cd52,
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
