<template>
  <q-btn round flat>
    <q-avatar size="36px" :style="{'background-color':userData.color}" class="text-white">
      {{ userData.initials }}
    </q-avatar>
    <q-menu>
      <q-list>
        <q-item @click="logOut()" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="logout" color="negative"/>
          </q-item-section>
          <q-item-section>
            Log Out
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script lang="ts">
import { useAuthStore } from 'src/stores/auth'
import { computed, defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup () {
    const $auth = useAuthStore()
    const $router = useRouter()
    const userData = computed(() => $auth.getUserData)

    const logOut = () => {
      $auth.logOut()
      $router.replace('/auth/login')
    }

    return {
      userData,
      logOut
    }
  }
})
</script>

<style scoped>

</style>
