<template>
  <q-page padding>
    <div class="row">
      <div class="col-xs-12">
        <q-card flat bordered>
          <q-toolbar>
            <q-toolbar-title>My Wishlist</q-toolbar-title>
            <q-space></q-space>
            <q-btn flat round dense icon="sync" @click="refresh()">
              <q-tooltip>Refresh</q-tooltip>
            </q-btn>
          </q-toolbar>
          <q-separator/>
          <q-card-section class="q-pa-sm" v-if="favorites.length > 0">
            <div class="row">
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 q-pa-xs" v-for="(book,index) in favorites" :key="index">
                <Book :book="book" section="favorites" :index="index" />
              </div>
            </div>
          </q-card-section>
          <q-card-section v-if="favorites.length === 0">
            <div class="row flex flex-center">
              <div class="text-h4">No books found!</div>
            </div>
            <EmptyImage />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { useMeta } from 'quasar';
import { useCartStore } from 'src/stores/cart';
import { computed, defineComponent, ref } from 'vue'
import EmptyImage from 'src/components/EmptyImage.vue'
import Book from 'src/components/Book.vue'
import { axios } from 'src/boot/axios';
import { showErrorMessage } from 'src/helpers/error-message';

export default defineComponent({
  name:'Wishlist',

  components:{
    EmptyImage,
    Book,
  },

  setup () {
    const title = ref(`Wishlist | ${process.env.TITLE}`);
    useMeta(() => {
      return {
        title: title.value,
      };
    });

    const $cart = useCartStore()
    const favorites = computed(() => $cart.getFavorites);

    const refresh = () => {
      axios.post(`${process.env.API}/books/favorites`)
      .then(res => {
        $cart.setFavorites(res.data.favorites);
      })
      .catch((error:any) => {
        console.log(error)
        showErrorMessage(error)
      });
    };

    return {
      favorites,
      refresh
    }
  }
})
</script>

<style scoped>

</style>
