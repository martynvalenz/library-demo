<template>
  <q-page :padding="$q.screen.gt.xs" :class="$q.screen.xs ? 'q-pa-xs':''">
    <div class="row">
      <div class="col-xs-12">
        <q-card flat bordered>
          <q-toolbar>
            <div class="q-pa-xs">
              <q-btn-dropdown color="secondary" :label="userName ? userName : 'Select User'" no-caps>
                <q-list>
                  <q-item v-for="user in users" :key="user.id" clickable v-close-popup @click="selectUser(user)">
                    <q-item-section>
                      <q-item-label>{{user.username}}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </div>
            <q-space></q-space>
            <q-btn flat round dense icon="sync" @click="changePage()">
              <q-tooltip>Refresh</q-tooltip>
            </q-btn>
          </q-toolbar>
          <q-separator/>
          <q-card-section class="q-pa-sm" v-if="books.length > 0">
            <div class="row">
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 q-pa-xs" v-for="book in books" :key="book.id">
                <Book :book="book" section="dashboard" />
              </div>
            </div>
            <div class="row flex flex-center">
              <div class="row q-pa-lg flex flex-center">
                <q-pagination
                  v-model="parameters.page"
                  :max="parameters.totalPages"
                  direction-links
                  size="lg"
                  :max-pages="5"
                  boundary-numbers
                  @update:model-value="changePage()"
                />
              </div>
            </div>
          </q-card-section>
          <q-card-section v-else>
            <div class="row flex flex-center">
              <div class="text-h4">No books found!</div>
            </div>
            <div class="row flex flex-center q-pt-lg">
              <img src="/img/library.png" alt="desk" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <q-dialog v-model="categoryForm" :maximized="$q.screen.lt.md">
      <CategoryForm/>
    </q-dialog>
    <q-dialog v-model="bookForm" :maximized="$q.screen.lt.md">
      <BookForm :bookId="bookId" action="edit" />
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { LocalStorage, useMeta } from 'quasar';
import { useBookStore } from 'src/stores/books';
import { computed, defineComponent,onMounted,ref } from 'vue'
import CategoryForm from 'src/components/Dialogs/CategoryForm.vue';
import BookForm from 'src/components/Dialogs/BookForm.vue';
import Book from 'src/components/Book.vue';
import { useAuthStore } from 'src/stores/auth';
import {useBooks} from 'src/composables/useBooksComposable';
import { useUsersStore } from 'src/stores/users';

export default defineComponent({
  name: 'Dashboard',
  components: {
    CategoryForm,
    BookForm,
    Book
  },
  setup () {
    const title = ref(`Books | ${process.env.TITLE}`);
    useMeta(() => {
      return {
        title: title.value,
      };
    });

    const $books = useBookStore();
    const $auth = useAuthStore();
    const $users = useUsersStore();
    const optionList = ref('')
    const categoryForm = ref(false)
    const bookForm = ref(false)
    const user = ref('')
    const bookId = ref('')
    const userId = ref('')
    const userName = ref('')
    const books = computed(() => $books.getBooks);
    const parameters = computed(() => $books.parameters);
    const users = computed(() => $users.showAllUsers);

    onMounted(() => {
      getBooks()
    });
    const userData = computed(() => $auth.userData);

    const {getBooks} = useBooks()

    const changePage = () => {
      getBooks()
    }

    const selectUser = (user:any) => {
      userId.value = user.id;
      userName.value = user.username;
    }

    return {
      user,
      userData,
      optionList,
      books,
      parameters,
      bookId,
      userId,
      userName,
      users,
      categoryForm,
      bookForm,
      changePage,
      selectUser,
    }
  }
})
</script>

<style scoped>

</style>
