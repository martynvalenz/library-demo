<template>
  <q-layout view="hHr LpR fFr" class="bg-grey-3">
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

        <div>
          <q-btn-group v-if="userData.role === 'Admin'">
            <q-btn-dropdown
              :label="selectedUser.username ? selectedUser.username : 'Filter by Category'"
              color="primary"
              no-caps
            >
              <q-list>
                <q-item
                  v-for="user in users"
                  :key="user.id"
                  v-close-popup
                  @click="selectUser(user)"
                  clickable
                >
                  <q-item-section>
                    <q-item-label :class="selectedUser.id === user.id ? 'text-accent':''">{{user.username}}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
            <q-btn v-if="selectedUser.id !== userData.id" color="primary" icon="close" @click="clearUser()" />
          </q-btn-group>
          <q-chip v-else :size="$q.screen.gt.xs ? 'lg':'md'" color="primary" dark>{{userData.name}} {{userData.lastName}}</q-chip>
        </div>

        <q-space />

        <div class="q-pl-md q-gutter-sm row no-wrap items-center">

          <q-btn round dense flat color="grey-8" icon="shopping_cart" @click="toggleRightDrawer()">
            <q-badge color="red" text-color="white" floating v-if="cart.length > 0">
              {{ cart.length }}
            </q-badge>
            <q-tooltip>Cart</q-tooltip>
          </q-btn>
          <q-btn round dense flat color="grey-8" icon="notifications" v-if="userData.role === 'Admin'">
            <q-badge color="red" text-color="white" floating v-if="notifications.length > 0">
              {{ notifications.length }}
            </q-badge>
            <q-tooltip>Notifications</q-tooltip>
            <Notifications v-on:openNotification="openNotification($event)" />
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

    <q-drawer v-model="rightDrawerOpen" side="right" elevated behavior="mobile" :width="380">
      <q-toolbar>
        <q-btn @click="toggleRightDrawer()" icon="close" round dense flat />
        <q-toolbar-title>
          Books Cart
        </q-toolbar-title>
      </q-toolbar>
      <Cart v-on:closeCart="closeCart()" />
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
import Notifications from 'src/components/Notifications.vue'
import Cart from 'src/components/Cart.vue'
import { useUsersStore } from 'src/stores/users'
import { useCartStore } from 'src/stores/cart';

export default {
  name: 'Admin',

  components: {
    MainMenu,
    UserMenu,
    Cart,
    Notifications,
  },

  setup () {
    const leftDrawerOpen = ref(false)
    const rightDrawerOpen = ref(false)
    const storage = ref(0.26)
    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value
    }
    const toggleRightDrawer = () => {
      rightDrawerOpen.value = !rightDrawerOpen.value
    }

    const $auth = useAuthStore()
    const $books = useBookStore()
    const $users = useUsersStore()
    const $cart = useCartStore()
    const userData = computed(() => $auth.getUserData)
    onMounted(() => {
      getUserData()
    });
    const users = computed(() => $users.showAllUsers);
    const selectedUser = computed(() => $users.selectedUser);
    const cart = computed(() => $cart.getCart);
    const notifications = computed(() => $auth.notifications);

    const getUserData = () => {
      axios.get(`${process.env.API}/auth/userData`)
      .then(res => {
        $auth.setUserData(res.data.user)
        $books.setCategories(res.data.categories)
        $users.setUsers(res.data.users)
        $users.setSelectedUser(res.data.user)
        $cart.setFavorites(res.data.favorites)
        $cart.setCart(res.data.cartBooks)
        $cart.setLoans(res.data.loanBooks)
        $auth.setNotifications(res.data.notifications)
      })
      .catch(error => {
        console.log(error)
        showErrorMessage(error);
        $auth.logOut()
        $router.replace('/auth/login')
      })
    }

    const selectUser = (user) => {
      $users.setSelectedUser(user)
      viewCart(user.id)
    }

    const clearUser = () => {
      $users.setSelectedUser(userData.value)
      viewCart(userData.value.id)
    }

    const viewCart = (id) => {
      axios.put(`${process.env.API}/books/view-cart/${id}`)
      .then(res => {
        $cart.setCart(res.data.cartBooks)
        $cart.setLoans(res.data.loanBooks)
      })
      .catch(error => {
        console.log(error)
        showErrorMessage(error);
      })
    }

    const openNotification = (id) => {
      axios.put(`${process.env.API}/books/accept-request/${id}`)
      .then(res => {
        $users.setSelectedUser(res.data.selectedUser)
        viewCart(res.data.selectedUser.id)
        rightDrawerOpen.value = true
        $auth.selectNotification(id)
      })
      .catch(error => {
        console.log(error)
        showErrorMessage(error);
      })
    }

    const closeCart = () => {
      rightDrawerOpen.value = false
    }

    return {
      userData,
      users,
      selectedUser,
      leftDrawerOpen,
      rightDrawerOpen,
      cart,
      notifications,
      storage,
      viewCart,
      toggleLeftDrawer,
      toggleRightDrawer,
      selectUser,
      clearUser,
      openNotification,
      closeCart,
    }
  }
}
</script>
