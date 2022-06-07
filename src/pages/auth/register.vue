<template>
  <q-page>
    <div class="row full-height flex">
      <div class="col-md-7 bg-grey-3" style="height: 95vh" v-if="$q.screen.gt.sm">
        <!-- <q-toolbar>
          <img src="/logos/title.png" alt="GoVita" style="height:40px">
        </q-toolbar> -->
        <div class="row flex flex-center items-center" style="height: 90vh">
          <q-card class="bg-transparent" flat>
            <img src="/img/library.png" alt="desk" />
          </q-card>
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-5 bg-grey-1">
        <div class="row flex flex-center" style="height: 94vh">
          <q-card
            flat
            class="bg-transparent"
            :style="$q.screen.gt.sm ? { width: '500px' } : ''"
            :class="$q.screen.gt.sm ? 'q-px-md' : ''"
          >
            <q-toolbar>
              <q-toolbar-title class="text-center">
                <img src="/logos/logo-title.png" alt="GoVita" style="height:60px">
              </q-toolbar-title>
            </q-toolbar>
            <q-form>
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
                      :type="hidePassword ? 'password' : 'text'"
                    >
                      <template v-slot:prepend>
                        <q-icon name="password" />
                      </template>
                      <template v-slot:append>
                        <q-btn
                          :label="hidePassword ? 'Show' : 'Hide'"
                          size="14px"
                          dense
                          flat
                          color="primary"
                          no-caps
                          @click="hidePassword = !hidePassword"
                        ></q-btn>
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
                      to="/admin"
                      no-caps
                      :loading="loading"
                      @click="signUp()"
                    >
                      <template v-slot:loading>
                        <q-spinner-facebook />
                      </template>
                    </q-btn>
                  </div>
                </div>
                <div class="row q-pt-md text-center">
                  <div class="col-xs-12 q-pa-sm text-subtitle1">
                    I already have an account?
                    <router-link to="/auth/login" class="linker"
                      >Sign In</router-link
                    >
                  </div>
                </div>
              </q-card-section>
            </q-form>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useMeta } from "quasar";
import { api } from "src/boot/axios";
import { useAuthStore } from 'stores/auth'
import { notification } from "src/helpers/notify";
import { useRouter } from "vue-router";
import { manageErrors } from "src/helpers/manage-errors";
export default defineComponent({
  setup() {
    const $router = useRouter();
    const $auth = useAuthStore();
    const title = ref(`Register | ${process.env.TITLE}`);
    useMeta(() => {
      return {
        // whenever "title" from above changes, your meta will automatically update
        title: title.value,
      };
    });
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

    const signUp = () => {
      loading.value = true;
      api.post("/auth/sign-up", {
        name: name.value,
        lastName: lastName.value,
        email: email.value,
        password: password.value,
      })
      .then(async (res: any) => {
        await $auth.signIn(res.data.token)
        loading.value = false;
        notification(
          `Welcome to the library app, ${res.data.name} ${res.data.lastName}`,
          "positive"
        );
        $router.replace({ name: "Admin" });
      })
      .catch((error) => {
        console.log(error);
        loading.value = false;
        if (error.response.data.errors) {
          errors.value = error.response.data.errors;
        }
        manageErrors(error);
      });
    };

    return {
      name,
      lastName,
      email,
      password,
      hidePassword,
      errors,
      loading,
      signUp,
    };
  },
});
</script>
