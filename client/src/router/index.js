/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'
import Upload from '@/pages/Upload'
import LoadCurrentMonth from '@/pages/LoadCurrentMonth'
import MainView from '@/pages/MainView'
import Repo from '@/pages/Repo'
import NewPerson from '@/pages/NewPerson'
import DelPerson from '@/pages/DelPerson'
import NotFound from '@/pages/NotFound'
import AccessCell from '@/components/AccessCell'
import Portal from '@/pages/Portal'

Vue.use(Router)

export default new Router({
  mode: 'history',
//  base: '/dist/',
  routes: [
    {
      path: '/',
      name: 'LoadCurrentMonth',
      component: LoadCurrentMonth
    },
    {
      path: '/portal',
      name: 'Portal',
      component: Portal
    },
    {
      path: '/:pod/:year/:month',
      name: 'MainView',
      component: MainView
    },
    {
      path: '/:pod/:year/:month/report',
      name: 'Repo',
      component: Repo
    },
    // {
    //   path: '/:pod/:year/:month/person',
    //   name: 'NewPerson',
    //   component: NewPerson
    // },
    // {
    //   path: '/:pod/:year/:month/delete',
    //   name: 'DelPerson',
    //   component: DelPerson
    // },
    {
      path: '/:pod/upload',
      name: 'Upload',
      component: Upload
    },
    {
      path:'*',
      name: 'NotFound',
      component: NotFound
    }
  ]
})
