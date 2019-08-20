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

Vue.use(Router)

export default new Router({
  mode: 'history',
//  base: '/dist/',
  routes: [
    {
      path: '/test',
      name: 'AccessCell',
      component: AccessCell
    },
    {
      path: '/',
      name: 'LoadCurrentMonth',
      component: LoadCurrentMonth
    },
    {
      path: '/AppService/:year/:month',
      name: 'MainView',
      component: MainView
    },
    {
      path: '/AppService/:year/:month/report',
      name: 'Repo',
      component: Repo
    },
    {
      path: '/AppService/:year/:month/person',
      name: 'NewPerson',
      component: NewPerson
    },
    {
      path: '/AppService/:year/:month/delete',
      name: 'DelPerson',
      component: DelPerson
    },
    {
      path: '/AppService/upload',
      name: 'Upload',
      component: Upload
    },
    {
      path: '/DEV/:year/:month',
      name: 'MainView',
      component: MainView
    },
    {
      path: '/DEV/:year/:month/report',
      name: 'Repo',
      component: Repo
    },
    {
      path: '/DEV/:year/:month/person',
      name: 'NewPerson',
      component: NewPerson
    },
    {
      path: '/DEV/:year/:month/delete',
      name: 'DelPerson',
      component: DelPerson
    },
    {
      path: '/DEV/upload',
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
