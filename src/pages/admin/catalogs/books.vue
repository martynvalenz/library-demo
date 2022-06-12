<template>
  <q-page :padding="$q.screen.gt.xs" :class="$q.screen.xs ? 'q-pa-xs':''">
    <div class="row">
      <div class="col-xs-12">
        <q-card flat bordered>
          <q-toolbar>
            <div class="row q-gutter-xs" v-if="userData.role === 'Admin'">
              <q-btn label="Book" icon-right="add" no-caps color="primary" @click="createBook()" />
              <q-btn label="Category" icon-right="add" no-caps color="secondary" @click="createCategory()" />
            </div>
            <q-space></q-space>
            <q-btn flat round dense icon="sync"></q-btn>
          </q-toolbar>
          <q-separator/>
          <q-card-section v-if="skeleton">
            <Skeleton />
          </q-card-section>
          <q-card-section class="q-pa-sm" v-if="books.length > 0 && !skeleton">
            <div class="row">
              <div class="col-xs-12 col-sm-6 col-md-4 q-pa-xs" v-for="(book,index) in books" :key="index">
                <Book :book="book" section="books" :index="index" />
              </div>
            </div>
          </q-card-section>
           <q-card-section v-if="books.length > 0 && !skeleton">
            <div class="row flex flex-center">
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
          </q-card-section>
          <q-card-section v-if="books.length === 0 && !skeleton">
            <div class="row flex flex-center">
              <div class="text-h4">No books found!</div>
            </div>
            <EmptyImage />
          </q-card-section>
        </q-card>
      </div>
    </div>
    <q-dialog v-model="categoryForm" :maximized="$q.screen.lt.md">
      <CategoryForm/>
    </q-dialog>
    <q-dialog v-model="bookForm" :maximized="$q.screen.lt.md">
      <BookForm :action="action" :bookId="bookId" v-on:closeBookDialog="closeBookDialog()" />
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
import Skeleton from 'src/components/Skeleton.vue';
import EmptyImage from 'src/components/EmptyImage.vue';
import { useAuthStore } from 'src/stores/auth';
import { axios } from 'src/boot/axios';
import { useBooks } from 'src/composables/useBooksComposable';

export default defineComponent({
  name: 'Catalogs',
  components: {
    CategoryForm,
    BookForm,
    Book,
    Skeleton,
    EmptyImage,
},
  setup () {
    const title = ref(`Catalogs | ${process.env.TITLE}`);
    useMeta(() => {
      return {
        title: title.value,
      };
    });

    const $books = useBookStore();
    const $auth = useAuthStore();
    const optionList = ref('')
    const categoryForm = ref(false)
    const bookForm = ref(false)
    const user = ref('')
    const books = computed(() => $books.getBooks);
    const parameters = computed(() => $books.parameters);
    const bookId = ref('')
    const action = ref('')

    onMounted(() => {
      optionList.value = LocalStorage.getItem('optionList') || 'list';
    });

    const userData = computed(() => $auth.userData);

    onMounted(() => {
      $books.setPage(1);
      getBooksAdmin()
    });

    const {getBooksAdmin,skeleton} = useBooks()

    const createCategory = () => {
      categoryForm.value = true
    }

    const createBook = () => {
      bookId.value = ''
      action.value = 'create'
      bookForm.value = true
    }

    const closeBookDialog = () => {
      bookId.value = ''
      action.value = 'create'
      bookForm.value = false
    }

    const changePage = () => {
      getBooksAdmin()
    }

    return {
      user,
      userData,
      optionList,
      books,
      skeleton,
      parameters,
      categoryForm,
      bookForm,
      bookId,
      action,
      createCategory,
      createBook,
      closeBookDialog,
      changePage
    }
  }
})
</script>

<style scoped>

</style>
