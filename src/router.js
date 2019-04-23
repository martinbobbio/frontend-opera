import Vue from 'vue'
import Router from 'vue-router'
import { auth } from '@/firebase'

import Home from './views/Home.vue'
import NotFound from './views/NotFound.vue'

import Register from './views/user/Register.vue'
import Login from './views/user/Login.vue'
import VerificationEmail from './views/user/VerificationEmail.vue'
import ActionsEmail from './views/user/ActionsEmail.vue'
import Profile from './views/user/Profile.vue'
import ProfilePhoto from './views/user/ProfilePhoto.vue'

import Show from './views/theatre/Show.vue'
import Presentation from './views/theatre/Presentation.vue'


Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/session/login',
            name: 'login',
            component: Login
        },
        {
            path: '/session/register',
            name: 'register',
            component: Register
        },
        {
            path: '/session/:username',
            name: 'profile',
            component: Profile,
            meta:{
                auth:true
            }
        },
        {
            path: '/session/photo',
            name: 'profilePhoto',
            component: ProfilePhoto,
            meta:{
                auth:true
            }
        },
        {
            path: '/session/verification-email',
            name: 'verification-email',
            component: VerificationEmail
        },
        {
            path: '/session/actions-email',
            name: 'actions-email',
            component: ActionsEmail
        },
        {
            path: '/shows/:id',
            name: 'show',
            component: Show
        },
        {
            path: '/shows/:showId/:theatreId/:date',
            name: 'presentation',
            component: Presentation
        },
        {
            path: '/404',
            name: '404',
            component: NotFound
        },
        {
            path: '*',
            component: NotFound
        },
    ]
})

router.beforeEach((to, from, next) => {
    let user = auth.currentUser

    if(to.matched.some(record => record.meta.auth)){
        if(user){
            if(user.providerData[0].providerId == 'password' && !user.emailVerified){
                next({ name: 'verification-email'})
            }else{
                next()
            }
        }else{
            next({ name:'login' })
        }
    }else{
        next()
    }
})

export default router