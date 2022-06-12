<template>
  <q-scroll-area class="fit">
    <q-list separator >
      <q-item v-for="book in cart" :key="book.id">
        <q-item-section avatar>
          <q-img :src="book.coverImage"></q-img>
        </q-item-section>
        <q-item-section>
          <q-item-label caption>Title</q-item-label>
          <q-item-label lines="3">{{book.title}}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-item-label caption class="text-center">Stock</q-item-label>
          <q-item-label class="text-center">
            <q-badge :color="book.stock > 1 ? 'primary':book.stock == 1 ? 'orange' : 'negative'">{{book.stock}}</q-badge>
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn icon="close" color="negative" round dense flat @click="removeBook(book.id)" />
        </q-item-section>
      </q-item>
      <q-item>
        <q-btn
          :disable="cart.length == 0"
          class="full-width"
          color="negative"
          label="Clear Cart"
          no-caps
          outline
          icon-right="remove_shopping_cart"
          @click="clearCart()"
        />
      </q-item>
      <q-item v-if="cart.length === 0 || userData.role === 'Admin'">
        <q-btn
          :disable="cart.length === 0"
          class="full-width"
          color="positive"
          label="Confirm Loan"
          no-caps
          icon-right="shopping_cart_checkout"
          @click="confirmLoan()"
        />
      </q-item>
      <q-item v-if="userData.role === 'User'">
        <q-btn
          :disable="cart.length === 0"
          class="full-width"
          color="primary"
          label="Request Loan"
          no-caps
          icon-right="notifications_active"
          @click="requestLoan()"
        />
      </q-item>
    </q-list>
    <q-list v-if="cart.length === 0">
      <q-item>
        <q-item-section avatar>
          <q-icon name="warning" color="orange"></q-icon>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-h6">The cart is empty!</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-scroll-area>
</template>

<script lang="ts">
import {axios} from 'src/boot/axios';
import { manageErrors } from 'src/helpers/manage-errors';
import { notification } from 'src/helpers/notify';
import { useAuthStore } from 'src/stores/auth';
import { useCartStore } from 'src/stores/cart';
import { useUsersStore } from 'src/stores/users';
import { computed, defineComponent, reactive } from 'vue'

export default defineComponent({
  setup (_,{emit}) {

    const $cart = useCartStore();
    const $auth = useAuthStore();
    const $user = useUsersStore();

    const cart = computed(() => $cart.getCart);
    const userData = computed(() => $auth.getUserData);
    const selectedUser = computed(() => $user.selectedUser);

    const clearCart = () => {
      axios.post(`${process.env.API}/books/clear-cart`)
      .then(res => {
        $cart.clearCart();
        notification(res.data.msg,res.data.color);
      });
    }

    const removeBook = (bookId:string) => {
      axios.put(`${process.env.API}/books/remove-from-cart/${bookId}`)
      .then(res => {
        $cart.removeFromCart(res.data.bookId);
      });
    }

    const confirmLoan = () => {
      axios.post(`${process.env.API}/books/confirm-loan`,{
        userId:selectedUser.value.id,
        cart:cart.value
      })
      .then(res => {
        $cart.loanBooks(res.data.loanedBooks);
        emit('closeCart')
        $auth.spliceNotification();
        notification(res.data.msg,res.data.color);
      })
      .catch(error => {
        console.log(error)
        manageErrors(error);
      })
    }

    const requestLoan = () => {
      axios.post(`${process.env.API}/books/request-loan`)
      .then(res => {
        notification(res.data.msg,res.data.color);
        emit('closeCart');
      })
      .catch(error => {
        console.log(error)
        manageErrors(error);
      })
    }

    return {
      cart,
      userData,
      clearCart,
      removeBook,
      confirmLoan,
      requestLoan
    }
  }
})
</script>

<style scoped>

</style>
