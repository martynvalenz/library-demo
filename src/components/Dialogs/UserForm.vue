<template>
  <q-card :style="$q.screen.gt.xs ? {'width':'800px'}:''">
    <q-toolbar>
      <q-toolbar-title>
        {{ createAdmin ? 'Create Admin':'Create User' }}
      </q-toolbar-title>
      <q-btn icon="close" round flat dense v-close-popup />
    </q-toolbar>
    <q-form @submit.prevent="saveUser()">
      <q-card-section>
        <div class="row">
          <div class="col-xs-12 q-pa-sm">
            <q-input v-model.trim="name" label="Name" outlined/>
            <div class="text-subtitle2 text-red" v-for="error in errors.name" :key="error">
              {{error}}
            </div>
          </div>
          <div class="col-xs-12 q-pa-sm">
            <q-input v-model.trim="lastName" label="Last Name" outlined/>
            <div class="text-subtitle2 text-red" v-for="error in errors.lastName" :key="error">
              {{error}}
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 q-pa-sm">
            <q-input v-model.trim="email" label="Email" outlined>
              <template v-slot:prepend>
                <q-icon name="mail" />
              </template>
            </q-input>
            <div class="text-subtitle2 text-red" v-for="error in errors.email" :key="error">
              {{error}}
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 q-pa-sm">
            <q-input
              v-model.trim="password"
              label="Password"
              outlined
            >
              <template v-slot:prepend>
                <q-icon name="password" />
              </template>
            </q-input>
            <div class="text-subtitle2 text-red" v-for="error in errors.password" :key="error">
              {{error}}
            </div>
          </div>
        </div>
        <div class="row q-py-sm">
          <div class="col-xs-12 q-pa-sm">
            <q-btn
              class="full-width rounded-borders text-weight-bold"
              color="primary"
              label="Create Account"
              style="font-size: 18px"
              no-caps
              :loading="loading"
              type="submit"
            >
              <template v-slot:loading>
                <q-spinner-facebook />
              </template>
            </q-btn>
          </div>
        </div>
      </q-card-section>
    </q-form>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { axios } from 'src/boot/axios';
import { manageErrors } from 'src/helpers/manage-errors';
import { useUsersStore } from 'src/stores/users';

export default defineComponent({
  name:'UserForm',
  props:{
    createAdmin: {
      type: Boolean,
      default: false,
    },
  },

  setup (props,{emit}) {
    const $users = useUsersStore();
    const name = ref("");
    const lastName = ref("");
    const email = ref("");
    const password = ref("");
    const hidePassword = ref(true);
    const loading = ref(false);
    let errors = ref({
      name:'',
      lastName:'',
      email: "",
      password: "",
    });


    const saveUser = () => {
      loading.value = true;
      axios.post(`${process.env.API}/users/store`, {
        name: name.value,
        lastName: lastName.value,
        email: email.value,
        password: password.value,
        createAdmin: props.createAdmin,
      }).then(res => {
        loading.value = false;
        $users.pushUser(res.data.user);
        emit('closeUserForm');

      }).catch(error => {
        console.log(error);
        loading.value = false;
        if (error.response.data.errors) {
          errors.value = error.response.data.errors;
        }
        manageErrors(error);
      });
    }

    return {
      name,
      lastName,
      email,
      password,
      hidePassword,
      loading,
      errors,
      saveUser,
    }
  }
})
</script>

<style scoped>

</style>
