<template>
  <div class="row">
    <div class="col-xs-12 col-sm-6 col-md-4 q-pa-xs" v-for="n in 9" :key="n">
      <q-card>
        <q-skeleton height="250px" square />
      </q-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup () {


    return {}
  }
})
</script>

<style scoped>

</style>
