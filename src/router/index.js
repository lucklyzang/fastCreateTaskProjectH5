import Vue from 'vue'
import Router from 'vue-router'
import { getStore } from '@/common/js/utils.js'
import store from '@/store'
const Home = () => import ('@/pages/Home')   
// 中央运送
const CreateDispathTask = () => import('@/pages/transManagementPackage/CreateDispathTask')
const ChooseTransPartentType = () => import('@/pages/transManagementPackage/ChooseTransPartentType')
// 工程维修
const CreateRepairsTask = () => import('@/pages/projectManagementPackage/createRepairsTask')
Vue.use(Router)
let baseRoute = [
    {
        path: '/',
        name: 'home',
        component: Home,
        meta: { index: 1 }
    },
    // 中央运送路由
    {
        path: '/createDispathTask',
        name: 'createDispathTask',
        component: CreateDispathTask,
        meta: { index: 3 }
    },
    {
        path: '/chooseTransPartentType',
        name: 'chooseTransPartentType',
        component: ChooseTransPartentType,
        meta: { index: 2 }
    },
    // 工程维修路由
    {
        path: '/createRepairsTask',
        name: 'createRepairsTask',
        component: CreateRepairsTask,
        meta: { index: 2 }
    }
];
let router = new Router({
    routes: baseRoute,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            // return {
            //     x: 0,
            //     y: 0
            // }
        }
    }
});
// router.beforeEach((to, from, next) => {
//     let name = to.name;
//     next({ path: '/home' })
// });
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
};
export default router