<template>
  <q-card>
    <q-card-section horizontal>
      <q-img
        :class="$q.screen.lt.md ? 'col-5':'col-4'"
        :src="book.coverImage"
        contain
      >
      </q-img>
      <q-list :class="$q.screen.lt.md ? 'col-7':'col-8'">
        <q-item>
          <q-item-section>
            <q-item-label caption>Title</q-item-label>
            <q-item-label class="text-h6">{{book.title}}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label caption>Stock</q-item-label>
            <q-item-label>
              <q-badge v-if="book.stock > 1">{{book.stock}}</q-badge>
              <q-badge v-if="book.stock === 1" color="orange">{{book.stock}}</q-badge>
              <q-badge v-if="book.stock === 0" color="negative">No Stock</q-badge>
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label caption>Author</q-item-label>
            <q-item-label>{{book.author}}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label caption>Category</q-item-label>
            <q-item-label>{{book.categoryId.category}}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label caption>Published</q-item-label>
            <q-item-label>{{book.year}}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <div class="row q-gutter-xs">
            <q-btn icon="shopping_cart" v-if="section === 'dashboard'" class="q-px-sm" dense color="primary" :disable="book.stock === 0">
              <q-tooltip>Add to cart</q-tooltip>
            </q-btn>
            <q-btn icon="thumb_up" v-if="section === 'dashboard'" class="q-px-sm" dense color="secondary">
              <q-tooltip>Add to Wishlist</q-tooltip>
            </q-btn>
            <q-btn icon="edit" class="q-px-sm" dense color="warning" v-if="userData.role === 'Admin' && section === 'books'" @click="editBook()">
              <q-tooltip>Edit book</q-tooltip>
            </q-btn>
          </div>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
  <q-dialog v-model="bookForm" :maximized="$q.screen.lt.md">
    <BookForm :bookId="book.id" action="edit" />
  </q-dialog>
</template>

<script lang="ts">
import { useAuthStore } from 'src/stores/auth'
import { computed, defineComponent, ref } from 'vue'
import BookForm from 'src/components/Dialogs/BookForm.vue'

export default defineComponent({
  name:'BookComponent',

  props:{
    book:{
      type:Object,
      required:true
    },
    section:{
      type:String,
      required:true
    }
  },

  components:{
    BookForm
  },

  setup () {
    const bookForm = ref(false)
    const $auth = useAuthStore()

    const editBook = () => {
      bookForm.value = true
    }

    const userData = computed(() => $auth.getUserData)

    return {
      bookForm,
      userData,
      editBook
    }
  }
})
</script>

<style scoped>

</style>
