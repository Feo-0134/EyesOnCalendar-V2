import Vue from 'vue'
import Router from 'vue-router'
import Month from '@/components/Month'
import Upload from '@/components/Upload'
import LoadCurrentMonth from '@/comps/LoadCurrentMonth'
import MainView from '@/comps/MainView'
import Repo from '@/comps/Repo'
import NewPerson from '@/components/NewPerson'
import DelPerson from '@/components/DelPerson'
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
    }
  ]
})
