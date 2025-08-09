import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _66b08252 = () => interopDefault(import('../pages/church.vue' /* webpackChunkName: "pages/church" */))
const _6a52ab1d = () => interopDefault(import('../pages/courses.vue' /* webpackChunkName: "pages/courses" */))
const _9e9f941e = () => interopDefault(import('../pages/graph-church.vue' /* webpackChunkName: "pages/graph-church" */))
const _4c9afb36 = () => interopDefault(import('../pages/graph-course.vue' /* webpackChunkName: "pages/graph-course" */))
const _2319891c = () => interopDefault(import('../pages/graph-department.vue' /* webpackChunkName: "pages/graph-department" */))
const _200cb1a6 = () => interopDefault(import('../pages/graph-month.vue' /* webpackChunkName: "pages/graph-month" */))
const _00f4cd82 = () => interopDefault(import('../pages/inspire.vue' /* webpackChunkName: "pages/inspire" */))
const _b55ba7ae = () => interopDefault(import('../pages/level.vue' /* webpackChunkName: "pages/level" */))
const _7143f6d2 = () => interopDefault(import('../pages/module.vue' /* webpackChunkName: "pages/module" */))
const _23bf23f6 = () => interopDefault(import('../pages/report-students.vue' /* webpackChunkName: "pages/report-students" */))
const _9a719318 = () => interopDefault(import('../pages/request.vue' /* webpackChunkName: "pages/request" */))
const _ac698da2 = () => interopDefault(import('../pages/requests.vue' /* webpackChunkName: "pages/requests" */))
const _3f931b8d = () => interopDefault(import('../pages/revisor-view.vue' /* webpackChunkName: "pages/revisor-view" */))
const _535310ae = () => interopDefault(import('../pages/revisors.vue' /* webpackChunkName: "pages/revisors" */))
const _df04b06c = () => interopDefault(import('../pages/section.vue' /* webpackChunkName: "pages/section" */))
const _14766b2d = () => interopDefault(import('../pages/section-asing.vue' /* webpackChunkName: "pages/section-asing" */))
const _1f0268bf = () => interopDefault(import('../pages/section-details.vue' /* webpackChunkName: "pages/section-details" */))
const _95ec142c = () => interopDefault(import('../pages/student-course-view.vue' /* webpackChunkName: "pages/student-course-view" */))
const _5afe9503 = () => interopDefault(import('../pages/students.vue' /* webpackChunkName: "pages/students" */))
const _12897e5f = () => interopDefault(import('../pages/students-view.vue' /* webpackChunkName: "pages/students-view" */))
const _1d523cad = () => interopDefault(import('../pages/users.vue' /* webpackChunkName: "pages/users" */))
const _502f3b12 = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/church",
    component: _66b08252,
    name: "church"
  }, {
    path: "/courses",
    component: _6a52ab1d,
    name: "courses"
  }, {
    path: "/graph-church",
    component: _9e9f941e,
    name: "graph-church"
  }, {
    path: "/graph-course",
    component: _4c9afb36,
    name: "graph-course"
  }, {
    path: "/graph-department",
    component: _2319891c,
    name: "graph-department"
  }, {
    path: "/graph-month",
    component: _200cb1a6,
    name: "graph-month"
  }, {
    path: "/inspire",
    component: _00f4cd82,
    name: "inspire"
  }, {
    path: "/level",
    component: _b55ba7ae,
    name: "level"
  }, {
    path: "/module",
    component: _7143f6d2,
    name: "module"
  }, {
    path: "/report-students",
    component: _23bf23f6,
    name: "report-students"
  }, {
    path: "/request",
    component: _9a719318,
    name: "request"
  }, {
    path: "/requests",
    component: _ac698da2,
    name: "requests"
  }, {
    path: "/revisor-view",
    component: _3f931b8d,
    name: "revisor-view"
  }, {
    path: "/revisors",
    component: _535310ae,
    name: "revisors"
  }, {
    path: "/section",
    component: _df04b06c,
    name: "section"
  }, {
    path: "/section-asing",
    component: _14766b2d,
    name: "section-asing"
  }, {
    path: "/section-details",
    component: _1f0268bf,
    name: "section-details"
  }, {
    path: "/student-course-view",
    component: _95ec142c,
    name: "student-course-view"
  }, {
    path: "/students",
    component: _5afe9503,
    name: "students"
  }, {
    path: "/students-view",
    component: _12897e5f,
    name: "students-view"
  }, {
    path: "/users",
    component: _1d523cad,
    name: "users"
  }, {
    path: "/",
    component: _502f3b12,
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
