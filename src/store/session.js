import { auth, db } from '@/firebase'
import router from '@/router'

export default {
    namespaced: true,
    state:{
        user:null,
    },
    mutations:{
        refreshUser(state, payload){
            state.user = payload;
        },
        refreshNames(state, payload){
            if(!state.user){ return }
            state.user.firstname = payload.firstname 
            state.user.lastname = payload.lastname 
        },
        refreshDescription(state, payload){
            if(!state.user){ return }
            state.user.description = payload.description
        },
        refreshBiography(state, payload){
            if(!state.user){ return }
            state.user.biography = payload.biography
        },
        refreshPhoto(state, payload){
            if(!state.user) return
            state.user.photo = payload
        }
    },
    actions:{
        exit({commit}){
            commit('refreshUser', null)
        },
        async login({commit}, uid){
            try{
                let doc = await db.collection('users').doc(uid).get()
                if(doc.exists){
                    let user = doc.data()
                    commit('refreshUser', user)
                    switch(router.currentRoute.name){
                        case 'login':
                            commit('showNotification', {message : `Bienvenido ${user.firstname}`, color: 'success'}, {root: true})
                            router.push({name:'home'})
                            break
                        case 'actions-email':
                            commit('showNotification', {message : `Bienvenido ${user.firstname}, se ha cambiado tu contraseña`, color: 'success'}, {root: true})
                            router.push({name:'home'})
                            break
                    }
                }else{
                    router.push({name:'register'})
                }
            }catch(error){
                commit('showNotification', {message:'Ocurrio un error consultando tu informacion', color:'error'}, {root: true})
            }
        },
        logout({commit}){
            auth.signOut()
            commit('refreshUser', null)
        }
    },
    getters:{
        photoProfile(state){
            if(!state.user || !state.user.photo) return require('@/assets/user-default.jpg')
            else return state.user.photo
        }
    }
}