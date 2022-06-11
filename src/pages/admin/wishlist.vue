<template>
  <div>

  </div>
</template>

<script lang="ts">
import { useMeta } from 'quasar';
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup () {
    const title = ref(`Wishlist | ${process.env.TITLE}`);
    useMeta(() => {
      return {
        title: title.value,
      };
    });

    return {}
  }
})
</script>

<style scoped>

</style>
