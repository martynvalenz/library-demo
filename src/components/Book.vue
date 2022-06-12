<template>
  <q-card>
    <q-card-section horizontal>
      <q-img
        :class="$q.screen.lt.md ? 'col-5':'col-4'"
        :src="book.coverImage"
        contain
      >
      </q-img>
      <q-card-section class="q-pa-xs" :class="$q.screen.lt.md ? 'col-7':'col-8'">
        <q-list >
          <q-item>
            <q-item-section>
              <q-item-label caption>Title</q-item-label>
              <q-item-label class="text-h6" lines="2">
                {{ book.title }}
                <q-tooltip>{{book.title}}</q-tooltip>
              </q-item-label>
            </q-item-section>
            <q-item-section side v-if="section !== 'loans'">
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
              <q-item-label lines="1">{{book.author}}</q-item-label>
            </q-item-section>
            <q-item-section side v-if="section === 'books'">
              <q-item-label caption>Status?</q-item-label>
              <q-item-label>
                <q-chip v-if="book.isActive" label="Active" color="positive" square class="q-px-sm" dark />
                <q-chip v-if="!book.isActive" label="Inactive" color="negative" square class="q-px-sm" dark />
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-if="$q.screen.gt.xs && book.category">
            <q-item-section>
              <q-item-label caption>Category</q-item-label>
              <q-item-label lines="1">{{book.category.category}}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label caption>Published</q-item-label>
              <q-item-label>{{book.year}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <q-card-actions class="position">
          <div class="row q-gutter-xs">
            <q-btn
              v-if="section === 'dashboard'"
              :disable="book.stock === 0"
              class="q-px-sm"
              color="primary"
              icon="shopping_cart"
              dense
              @click="addToCart(book)"
            >
              <q-tooltip>Add to cart</q-tooltip>
            </q-btn>
            <q-btn
              v-if="section === 'favorites'"
              :disable="book.stock === 0"
              class="q-px-sm"
              color="primary"
              icon="shopping_cart"
              dense
              @click="addToCartFromFavorites(book)"
            >
              <q-tooltip>Add to cart</q-tooltip>
            </q-btn>
            <q-btn icon="thumb_up" v-if="section === 'dashboard'" class="q-px-sm" dense color="secondary" @click="addToFavorites()">
              <q-tooltip>Add to Wishlist</q-tooltip>
            </q-btn>
            <q-btn icon="thumb_down" v-if="section === 'favorites'" class="q-px-sm" dense color="secondary" label="Remove" @click="removeFromFavorites()" no-caps />
            <q-btn icon="edit" class="q-px-sm" dense color="warning" v-if="userData.role === 'Admin' && section === 'books'" @click="editBook()">
              <q-tooltip>Edit book</q-tooltip>
            </q-btn>
            <q-btn icon="assignment_returned" class="q-px-sm" dense color="secondary" v-if="userData.role === 'Admin' && section === 'loans'" @click="turnInBook()">
              <q-tooltip>Turn in book</q-tooltip>
            </q-btn>
          </div>
        </q-card-actions>
      </q-card-section>
    </q-card-section>
  </q-card>
  <q-dialog v-model="bookForm" :maximized="$q.screen.lt.md">
    <BookForm :bookId="book.id" action="edit" v-on:closeBookDialog="closeBookDialog()" />
  </q-dialog>
</template>

<script lang="ts">
import { useAuthStore } from 'src/stores/auth'
import { computed, defineComponent, ref } from 'vue'
import BookForm from 'src/components/Dialogs/BookForm.vue'
import {axios} from 'src/boot/axios'
import { useCartStore } from 'src/stores/cart'
import { notification } from 'src/helpers/notify'
import { showErrorMessage } from 'src/helpers/error-message'
import { useUsersStore } from 'src/stores/users'

export default defineComponent({
  name:'BookComponent',

  props:{
    book:{
      type:Object,
      required:true
    },
    index:{
      type:Number,
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

  setup (props) {
    const bookForm = ref(false)
    const $auth = useAuthStore()
    const $users = useUsersStore()
    const $cart = useCartStore()

    const editBook = () => {
      bookForm.value = true
    }

    const userData = computed(() => $auth.getUserData);
    const selectedUser = computed(() => $users.selectedUser);

    const closeBookDialog = () => {
      bookForm.value = false
    }

    const removeFromFavorites = () => {
      axios.post(`${process.env.API}/books/remove-favorite`,{bookId:props.book.id})
      .then(res => {
        $cart.removeFromFavorites(res.data.bookId)
        notification(res.data.msg,res.data.color)
      })
      .catch((error:any) => {
        console.log(error)
        showErrorMessage(error)
      });
    }

    const addToCart = (book:any) => {
      axios.post(`${process.env.API}/books/add-to-cart`,{bookId:book.id,userId:selectedUser.value.id})
      .then(res => {
        notification(res.data.msg,res.data.color)
        if(res.data.success){
          $cart.addToCart(book)
        }
      })
      .catch((error:any) => {
        console.log(error)
        showErrorMessage(error)
      });
    }

    const addToCartFromFavorites = (book:any) => {
      axios.post(`${process.env.API}/books/add-to-cart-from-favorites`,{bookId:book.id})
      .then(res => {
        notification(res.data.msg,res.data.color)
        if(res.data.success){
          $cart.addToCart(book)
        }
      })
      .catch((error:any) => {
        console.log(error)
        showErrorMessage(error)
      });
    }

    const addToFavorites = () => {
      axios.post(`${process.env.API}/books/add-favorite`,{bookId:props.book.id})
      .then(res => {
        if(res.data.success){
          $cart.pushFavorite(res.data.favorite)
        }
        notification(res.data.msg,res.data.color)
      })
      .catch((error:any) => {
        console.log(error)
        showErrorMessage(error)
      });
    }

    const turnInBook = () => {
      axios.put(`${process.env.API}/books/loans/turn-in/${props.book.id}`,{userId:selectedUser.value.id})
      .then(res => {
        $cart.removeFromLoans(props.index)
        notification(res.data.msg,res.data.color)
      })
      .catch((error:any) => {
        console.log(error)
        showErrorMessage(error)
      });
    }

    return {
      bookForm,
      userData,
      selectedUser,
      editBook,
      closeBookDialog,
      addToCart,
      addToCartFromFavorites,
      addToFavorites,
      removeFromFavorites,
      turnInBook,
    }
  }
})
</script>

<style scoped>

</style>
