import { defineStore } from 'pinia';
import { User } from 'src/components/models';

export const useUsersStore = defineStore('users', {
  state: () => ({
    users:Array<User>(),
    selectedUser:{
      id:'',
      username:'',
    }
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
    showAllUsers: (state) => {
      const users:any[] = [];
      state.users.forEach((user:User)=> {
        users.push({
          id: user.id,
          username:`${user.name} ${user.lastName}`,
          name: user.name,
          lastName: user.lastName,
        });
      });
      return users;
    }
  },
  actions: {
    setUsers(users: User[]) {
      this.users = users;
    },

    pushUser(user: User) {
      this.users.push(user)
    },

    updateMyAccount(user: User) {
      const index = this.users.findIndex(u => u.id === user.id);
      this.users[index].name = user.name;
      this.users[index].lastName = user.lastName;
      this.users[index].email = user.email;
      this.users[index].hasAccess = user.hasAccess;
    },

    setSelectedUser(user: User) {
      this.selectedUser.id = user.id;
      this.selectedUser.username = `${user.name} ${user.lastName}`;
    }
  },
});
