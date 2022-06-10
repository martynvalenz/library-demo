<template>
  <q-page padding>
    <q-card>
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="users" label="Users" />
        <q-tab name="admins" label="Admins" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="users">
          <div class="row q-pa-xs">
            <q-btn label="Create User" no-caps icon-right="person_add" color="primary" @click="createUser()" />
          </div>
          <Users :isAdmin="false"  />
        </q-tab-panel>

        <q-tab-panel name="admins">
          <div class="row q-pa-xs">
            <q-btn label="Create Admin" no-caps icon-right="manage_accounts" color="primary" @click="createUserAdmin()" />
          </div>
          <Users :isAdmin="true" />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
    <q-dialog v-model="userFormDialog" :maximized="$q.screen.xs">
      <UserForm :createAdmin="createAdmin" v-on:closeUserForm="closeUserForm" />
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { defineComponent,ref } from 'vue'
import Users from 'src/components/Users.vue';
import UserForm from 'src/components/Dialogs/UserForm.vue';
import { useMeta } from 'quasar';

export default defineComponent({
  name:'UsersPage',
  components: {
    Users,
    UserForm,
  },

  setup () {
    const title = ref(`Users | ${process.env.TITLE}`);
    useMeta(() => {
      return {
        title: title.value,
      };
    });
    const userFormDialog = ref(false);
    const createAdmin = ref(false);

    const createUser = () => {
      userFormDialog.value = true;
      createAdmin.value = false;
    }

    const createUserAdmin = () => {
      userFormDialog.value = true;
      createAdmin.value = true;
    }

    const closeUserForm = () => {
      userFormDialog.value = false;
      createAdmin.value = false;
    }

    return {
      tab: ref('users'),
      userFormDialog,
      createAdmin,
      createUser,
      createUserAdmin,
      closeUserForm,
    }
  }
})
</script>

<style scoped>

</style>
