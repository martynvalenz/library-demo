<template>
  <div class="row">
    <div class="col-xs-12 q-pa-xs" v-for="user in users" :key="user.id">
      <q-card bordered flat>
        <q-item>
          <q-item-section avatar>
            <q-avatar :style="{'background-color':user.color}" class="text-white">{{user.initials}}</q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label caption>Name</q-item-label>
            <q-item-label>{{user.name}} {{user.lastName}}</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label caption>Email</q-item-label>
            <q-item-label>{{user.name}} {{user.lastName}}</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label caption>Email</q-item-label>
            <q-item-label>{{user.name}} {{user.lastName}}</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label caption>Loans</q-item-label>
            <q-item-label>{{user.loans}}</q-item-label>
          </q-item-section>
          <q-item-section :side="user.role === 'Admin'">
            <q-item-label caption>Status?</q-item-label>
            <q-item-label>
              <q-chip square :color="user.hasAccess ? 'positive':'negative'" :label="user.hasAccess ? 'Active':'Inactive'" dark></q-chip>
            </q-item-label>
          </q-item-section>
          <q-item-section side v-if="user.role === 'User'">
            <q-btn icon="settings" round flat >
              <q-menu>
                <q-list separator>
                  <q-item>
                    <q-item-section>
                      <q-toggle
                        v-model="user.hasAccess"
                        color="positive"
                        label="The user has access?"
                        @update:model-value="updateUser(user)"
                      />
                    </q-item-section>
                  </q-item>
                  <q-item @click="changeUserToAdmin(user)" clickable>
                    <q-item-section>
                      <q-item-label>{{ user.role === 'User' ? 'Change role to Admin':'Change role to User' }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-item-section>
        </q-item>
      </q-card>
    </div>
  </div>
</template>

<script lang="ts">
import {axios} from 'src/boot/axios';
import { manageErrors } from 'src/helpers/manage-errors';
import { computed, defineComponent } from 'vue'
import { useUsersStore } from '../stores/users';
import { User } from './models';

export default defineComponent({
  name:'Users',

  props:{
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },

  setup (props) {
    const $users = useUsersStore();
    const users = computed(() => {
      if (props.isAdmin) {
        return $users.getAdmins;
      } else {
        return $users.getUsers;
      }
    });

    const updateUser = (user:User) => {
      axios.put(`${process.env.API}/users/update/${user.id}`, user)
      .then(res => {
        // $users.updateUser(user);
      }).catch(err => {
        manageErrors(err);
      });
    }

    const changeUserToAdmin = (user:User) => {
      user.role = 'Admin';
      updateUser(user);
    }

    return {
      users,
      updateUser,
      changeUserToAdmin
    }
  }
})
</script>

<style scoped>

</style>
