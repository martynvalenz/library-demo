<template>
  <q-menu auto-close>
    <q-list>
      <q-item @click="openNotification(item.id)" clickable v-ripple v-for="item in notifications" :key="item.id">
        <q-item-section avatar v-if="item.userId">
          <q-avatar size="36px" :style="{'background-color':item.userId.color}" class="text-white">
            {{ item.userId.initials }}
          </q-avatar>
        </q-item-section>
        <q-item-section>
          {{ item.text }}
        </q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>

<script lang="ts">
import { useAuthStore } from 'src/stores/auth'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name:'Notifications',
  setup (_,{emit}) {
    const $auth = useAuthStore()
    const notifications = computed(() => $auth.notifications)

    const openNotification = (id:string) => {
      emit('openNotification',id);
    }

    return {
      notifications,
      openNotification,
    }
  }
})
</script>

<style scoped>

</style>
