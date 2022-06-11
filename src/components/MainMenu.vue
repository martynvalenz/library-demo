<template>
  <q-list>
    <q-item class="GPLAY__drawer-link bg-grey-10 text-grey-3">
      <q-item-section avatar class="text-grey-1">
        <q-icon name="menu" />
      </q-item-section>
      <q-item-section class="text-grey-3">
        <q-item-label>Main Menu</q-item-label>
      </q-item-section>
    </q-item>

    <q-item clickable class="GPLAY__drawer-link GPLAY__drawer-link--books" to="/admin" exact-active-class="text-active">
      <q-item-section avatar class="bg-primary text-grey-1 text-center">
        <q-icon name="menu_book" />
      </q-item-section>
      <q-item-section class="apps-text">
        <q-item-label>Books</q-item-label>
      </q-item-section>
    </q-item>

    <q-item clickable class="GPLAY__drawer-link GPLAY__drawer-link--loans" to="/admin/my-loans" exact-active-class="text-active">
      <q-item-section avatar class="bg-secondary text-grey-1 text-center">
        <q-icon name="book" />
      </q-item-section>
      <q-item-section class="movies-text">
        <q-item-label>My Loans</q-item-label>
      </q-item-section>
    </q-item>

    <q-item clickable class="GPLAY__drawer-link GPLAY__drawer-link--wishlist" exact-active-class="text-active" :to="{name:'Wishlist'}">
      <q-item-section avatar class="bg-accent text-grey-1 text-center">
        <q-icon name="volunteer_activism" />
      </q-item-section>
      <q-item-section class="movies-text">
        <q-item-label>Wishlist</q-item-label>
      </q-item-section>
    </q-item>

    <q-item clickable class="GPLAY__drawer-link GPLAY__drawer-link--account" exact-active-class="text-active" :to="{name:'Account'}">
      <q-item-section avatar class="books-icon bg-warning text-grey-1 text-center">
        <q-icon name="person" />
      </q-item-section>
      <q-item-section class="books-text">
        <q-item-label>My Account</q-item-label>
      </q-item-section>
    </q-item>

    <q-item clickable class="GPLAY__drawer-link GPLAY__drawer-link--users" v-if="userData.role === 'Admin'" :to="{name:'Users'}" exact-active-class="text-active">
      <q-item-section avatar class="devices-icon bg-blue-grey-7 text-grey-1 text-center">
        <q-icon name="people" />
      </q-item-section>
      <q-item-section class="devices-text">
        <q-item-label>Users</q-item-label>
      </q-item-section>
    </q-item>

    <q-item clickable class="GPLAY__drawer-link GPLAY__drawer-link--users" v-if="userData.role === 'Admin'" :to="{name:'Books'}" exact-active-class="text-active">
      <q-item-section avatar class="devices-icon bg-blue-grey-7 text-grey-1 text-center">
        <q-icon name="view_list" />
      </q-item-section>
      <q-item-section class="devices-text">
        <q-item-label>Catalogs</q-item-label>
      </q-item-section>
    </q-item>

    <!-- <q-separator class="q-mb-md" />

    <q-item v-for="link in links1" :key="link.text" v-ripple dense clickable class="GPLAY__drawer-item">
      <q-item-section class="text-grey-8">
        <q-item-label>{{ link.text }}</q-item-label>
      </q-item-section>
    </q-item> -->
  </q-list>
</template>

<script lang="ts">
import { useAuthStore } from 'src/stores/auth'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  setup () {
    const $auth = useAuthStore()
    const userData = computed(() => $auth.getUserData)

    return {
      userData,
      links1: [
        { text: 'Account' },
        { text: 'Payment methods' },
        { text: 'My subscriptions' },
        { text: 'Redeem' },
        { text: 'Buy gift card' },
        { text: 'My wishlist' },
        { text: 'My Play activity' },
        { text: 'Parent guide' }
      ],
    }
  }
})
</script>

<style scoped>
.text-active{
  font-weight:900 !important;
  color:#f54768 !important;
}
</style>
