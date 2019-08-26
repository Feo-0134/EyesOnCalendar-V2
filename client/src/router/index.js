/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'
import Upload from '@/comps/Upload'
import LoadCurrentMonth from '@/comps/LoadCurrentMonth'
import MainView from '@/comps/MainView'
import Repo from '@/comps/Repo'
import NewPerson from '@/comps/NewPerson'
import DelPerson from '@/comps/DelPerson'
import NotFound from '@/comps/NotFound'
import AccessCell from '@/components/AccessCell'
import Portal from '@/comps/Portal'

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
      path: '/test',
      name: 'AccessCell',
      component: AccessCell
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
    {
      path: '/:pod/:year/:month/person',
      name: 'NewPerson',
      component: NewPerson
    },
    {
      path: '/:pod/:year/:month/delete',
      name: 'DelPerson',
      component: DelPerson
    },
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
