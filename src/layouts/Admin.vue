<template>
  <q-layout view="hHh LpR fFf" class="bg-grey-3">
    <q-header class="bg-grey-3 text-grey-9" reveal height-hint="60" elevated>
      <q-toolbar class="GPLAY__toolbar text-grey-6">
        <q-btn
          v-if="$q.platform.is.mobile || !leftDrawerOpen"
          flat
          dense
          round
          @click="toggleLeftDrawer"
          aria-label="Menu"
          icon="menu"
          class="q-mr-sm"
        />

        <div class="q-pr-lg" v-if="$q.screen.gt.xs">
          <img src="/logos/logo-title.png" alt="GoVita" style="height:45px">
        </div>

        <q-space />

        <div class="GPLAY__toolbar-input-container row no-wrap">
          <q-input dense outlined square v-model="search" placeholder="Search" class="bg-white col" />
          <q-btn class="GPLAY__toolbar-input-btn" color="primary" icon="search" unelevated v-if="$q.screen.gt.sm" />
        </div>

        <q-space />

        <div class="q-pl-md q-gutter-sm row no-wrap items-center">

          <q-btn round dense flat color="grey-8" icon="notifications">
            <q-badge color="red" text-color="white" floating>
              2
            </q-badge>
            <q-tooltip>Notifications</q-tooltip>
          </q-btn>

          <UserMenu v-if="$q.screen.gt.xs" />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-grey-3 text-grey-7"
      :width="200"
    >
      <MainMenu />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from 'src/stores/auth'
import { useBookStore } from 'src/stores/books'
import {axios} from 'src/boot/axios'
import MainMenu from 'src/components/MainMenu.vue'
import UserMenu from 'src/components/UserMenu.vue'
import { useUsersStore } from 'src/stores/users'

export default {
  name: 'Admin',

  components: {
    MainMenu,
    UserMenu
  },

  setup () {
    const leftDrawerOpen = ref(false)
    const search = ref('')
    const storage = ref(0.26)
    function toggleLeftDrawer () {
      leftDrawerOpen.value = !leftDrawerOpen.value
    }
    const $auth = useAuthStore()
    const $books = useBookStore()
    const $users = useUsersStore()
    const userData = computed(() => $auth.getUserData)
    onMounted(() => {
      getUserData()
    })

    const getUserData = () => {
      axios.get(`${process.env.API}/auth/userData`)
      .then(res => {
        $auth.setUserData(res.data.user)
        $books.setCategories(res.data.categories)
        $users.setUsers(res.data.users)
      })
      .catch(error => {
        console.log(error)
        showErrorMessage(error);
        $auth.logOut()
        $router.replace('/auth/login')
      })
    }

    return {
      userData,
      leftDrawerOpen,
      search,
      storage,
      toggleLeftDrawer
    }
  }
}
</script>
