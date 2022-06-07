<template>
  <q-layout view="hHh lpR fFf">

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-primary text-white">
      <q-toolbar dense>
        <q-toolbar-title>
          Versión {{ version || '' }}
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>

<script lang="ts">
import { defineComponent,ref } from 'vue'

export default defineComponent({
  setup () {
    const version:any = ref(process.env.VERSION || '')

    return {
      version
    }
  }
})
</script>

<style scoped>

</style>
