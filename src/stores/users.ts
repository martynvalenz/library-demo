import { defineStore } from 'pinia';
import { User } from 'src/components/models';

export const useUsersStore = defineStore('users', {
  state: () => ({
    users:Array<User>(),
  }),
  getters: {
    getUsers: (state) => {
      if(state.users.length > 0) {
        return state.users.filter(user => user.role === 'User');
      }
    },
    getAdmins: (state) => {
      if(state.users.length > 0) {
        return state.users.filter(user => user.role === 'Admin');
      }
    },
  },
  actions: {
    setUsers(users: User[]) {
      this.users = users;
    },

    pushUser(user: User) {
      this.users.push(user)
    },
  },
});
