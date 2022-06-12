import {axios} from 'src/boot/axios';
import { defineStore } from 'pinia';
import { LocalStorage } from 'quasar';
import { UserData,User,Notification } from 'src/components/models';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    selectedNotificationId:'',
    notifications: Array<Notification>(),
    userData:{
      id:'',
      color:'',
      initials:'',
      name:'',
      lastName:'',
      email:'',
      role:''
    } as UserData,
  }),
  getters: {
    getUserData: (state) => state.userData,
  },
  actions: {
    signInWithToken(data:any){
      LocalStorage.set('authorization',`${data.accessToken}`);
      axios.defaults.headers.common['authorization'] = `${data.accessToken}`;
      LocalStorage.set('isAuthenticated',true);
    },

    signIn(token:any){
      LocalStorage.set('token',`${token}`);
      axios.defaults.headers.common['token'] = `${token}`;
      LocalStorage.set('isAuthenticated',true);
    },

    setToken(token:string){
      LocalStorage.set('authorization',`${token}`);
      axios.defaults.headers.common['authorization'] = `${token}`;
    },

    setUserData(data:any){
      this.userData = data;
    },

    async logOut(){
      this.userData = {
        id:'',
        color:'',
        initials:'',
        name:'',
        lastName:'',
        email:'',
        role:''
      }
      this.logOutUser();
    },

    logOutUser(){
      LocalStorage.set('isAuthenticated',false);
      LocalStorage.set('token','');
      axios.defaults.headers.common['token'] = '';
    },

    updateMyAccount(user:User){
      this.userData.name = user.name;
      this.userData.lastName = user.lastName;
      this.userData.email = user.email;
    },

    setNotifications(data:any){
      this.notifications = data;
    },

    selectNotification(id:string){
      this.selectedNotificationId = id;
    },

    spliceNotification(){
      const index = this.notifications.findIndex(n => n.id === this.selectedNotificationId);
      this.notifications.splice(index,1);
    }
  }
});
