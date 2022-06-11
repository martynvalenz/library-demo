<template>
  <q-page padding>
    <div class="row flex flex-center">
      <div class="col-xs-12 col-sm-8 col-md-5">
        <q-card>
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
            <!-- <div class="row">
              <div class="col-xs-12 q-pa-sm">
                <q-toggle
                  v-model="hasAccess"
                  color="positive"
                  label="The user has access?"
                />
              </div>
            </div> -->
            <div class="row q-py-sm">
              <div class="col-xs-12 q-pa-sm">
                <q-btn
                  class="full-width rounded-borders text-weight-bold"
                  color="primary"
                  label="Save Account"
                  style="font-size: 18px"
                  no-caps
                  :loading="loading"
                  @click="saveAccount()"
                >
                  <template v-slot:loading>
                    <q-spinner-facebook />
                  </template>
                </q-btn>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { useMeta } from 'quasar';
import {axios} from 'src/boot/axios';
import { manageErrors } from 'src/helpers/manage-errors';
import { notification } from 'src/helpers/notify';
import { useAuthStore } from 'src/stores/auth';
import { useUsersStore } from 'src/stores/users';
import { defineComponent, onMounted, ref } from 'vue'

export default defineComponent({
  setup () {
    const title = ref(`My Account | ${process.env.TITLE}`);
    useMeta(() => {
      return {
        title: title.value,
      };
    });

    const id = ref("");
    const name = ref("");
    const lastName = ref("");
    const email = ref("");
    const password = ref("");
    const hidePassword = ref(true);
    const hasAccess = ref(false);
    const role = ref('');
    const loading = ref(false);
    let errors = ref({
      name:'',
      lastName:'',
      email: "",
      password: "",
    });

    const $users = useUsersStore();
    const $auth = useAuthStore();

    onMounted(() => {
      axios.get(`${process.env.API}/users/me`)
      .then(res => {
        id.value = res.data.user.id;
        name.value = res.data.user.name;
        lastName.value = res.data.user.lastName;
        email.value = res.data.user.email;
        hasAccess.value = res.data.user.hasAccess;
        role.value = res.data.user.role;
      })
      .catch(err => {
        console.log(err);
      });
    })

    const saveAccount = () => {
      loading.value = true;
      axios.put(`${process.env.API}/users/update/${id.value}`,{
        name: name.value,
        lastName: lastName.value,
        email: email.value,
        password: password.value,
        hasAccess: hasAccess.value,
        role: role.value,
      })
      .then(res => {
        loading.value = false
        $users.updateMyAccount(res.data.user)
        $auth.updateMyAccount(res.data.user)
        notification('The account has been updated','positive')
      })
      .catch(error => {
        console.log(error);
        loading.value = false;
        if (error.response.data.errors) {
          errors.value = error.response.data.errors;
        }
        manageErrors(error);
      })
    }

    return {
      name,
      lastName,
      email,
      password,
      hidePassword,
      hasAccess,
      loading,
      errors,
      saveAccount,
    }
  }
})
</script>

<style scoped>

</style>
