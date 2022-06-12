<template>
  <q-page padding>
    <div class="row">
      <div class="col-xs-12">
        <q-card flat bordered>
          <q-toolbar>
            <q-toolbar-title>{{user.username}}</q-toolbar-title>
            <q-space></q-space>
            <q-btn flat round dense icon="sync" @click="refresh()">
              <q-tooltip>Refresh</q-tooltip>
            </q-btn>
          </q-toolbar>
          <q-separator/>
          <q-card-section v-if="userData.role === 'Admin'">
            <q-btn
              @click="turnInAllBooks()"
              color="primary"
              icon-right="assignment_returned"
              label="Turn in all Books"
              no-caps
              :loading="loading"
            />
          </q-card-section>
          <q-card-section class="q-pa-sm" v-if="loans.length > 0">
            <div class="row">
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 q-pa-xs" v-for="(book,index) in loans" :key="index">
                <Book :book="book" section="loans" :index="index" />
              </div>
            </div>
          </q-card-section>
          <q-card-section v-if="loans.length === 0">
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
import { useUsersStore } from 'src/stores/users';
import { useAuthStore } from 'src/stores/auth';
import { notification } from 'src/helpers/notify';

export default defineComponent({
  name:'Loans',

  components:{
    EmptyImage,
    Book,
  },

  setup () {
    const title = ref(`Loans | ${process.env.TITLE}`);
    useMeta(() => {
      return {
        title: title.value,
      };
    });

    const $cart = useCartStore()
    const $auth = useAuthStore()
    const loans = computed(() => $cart.getLoans);
    const $user = useUsersStore()
    const loading = ref(false);

    const user = computed(() => $user.selectedUser)
    const userData = computed(() => $auth.userData)

    const refresh = () => {
      axios.post(`${process.env.API}/books/loans/${user.value.id}`)
      .then(res => {
        $cart.setLoans(res.data.bookLoans);
      })
      .catch((error:any) => {
        console.log(error)
        showErrorMessage(error)
      });
    };

    const turnInAllBooks = () => {
      loading.value = true;
      axios.put(`${process.env.API}/books/loans/turn-in-all-books`,{userId:user.value.id})
      .then(res => {
        loading.value = false;
        $cart.removeAllFromLoans()
        notification(res.data.msg,res.data.color)
      })
      .catch((error:any) => {
        console.log(error)
        showErrorMessage(error)
        loading.value = false;
      });
    }

    return {
      user,
      userData,
      loans,
      refresh,
      loading,
      turnInAllBooks
    }
  }
})
</script>

<style scoped>

</style>
