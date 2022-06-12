<template>
  <q-page :padding="$q.screen.gt.xs" :class="$q.screen.xs ? 'q-pa-xs':''">
    <div class="row">
      <div class="col-xs-12">
        <q-card flat bordered>
          <q-toolbar>
            <div class="q-pa-xs">
              <q-btn-group>
                <q-btn-dropdown
                  :label="selectedCategory.category ? selectedCategory.category : 'Filter by Category'"
                  color="primary"
                  no-caps
                >
                  <q-list>
                    <q-item
                      v-close-popup
                      @click="clearCategory()"
                      clickable
                    >
                      <q-item-section>
                        <q-item-label :class="selectedCategory.id === null ? 'text-accent':''">All Categories</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item
                      v-for="category in categories"
                      :key="category.id"
                      v-close-popup
                      @click="selectCategory(category)"
                      clickable
                    >
                      <q-item-section>
                        <q-item-label :class="selectedCategory.id === category.id ? 'text-accent':''">{{category.category}}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
                <q-btn color="primary" icon="close" v-if="selectedCategory.id" @click="clearCategory()" />
              </q-btn-group>
            </div>
            <q-space></q-space>
            <q-btn flat round dense icon="sync" @click="changePage()">
              <q-tooltip>Refresh</q-tooltip>
            </q-btn>
          </q-toolbar>
          <q-separator/>
          <q-card-section v-if="skeleton">
            <Skeleton />
          </q-card-section>
          <q-card-section class="q-pa-sm" v-if="books.length > 0 && !skeleton">
            <div class="row">
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 q-pa-xs" v-for="(book,index) in books" :key="index">
                <Book :book="book" section="dashboard" :index="index" />
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
import EmptyImage from 'src/components/EmptyImage.vue';
import Skeleton from 'src/components/Skeleton.vue';
import { useAuthStore } from 'src/stores/auth';
import {useBooks} from 'src/composables/useBooksComposable';
import { useUsersStore } from 'src/stores/users';

export default defineComponent({
  name: 'Dashboard',
  components: {
    CategoryForm,
    BookForm,
    Book,
    Skeleton,
    EmptyImage,
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
    const books = computed(() => $books.getBooks);
    const categories = computed(() => $books.getActiveCategories);
    const parameters = computed(() => $books.parameters);
    const selectedCategory = computed(() => $books.selectedCategory);
    const users = computed(() => $users.showAllUsers);

    onMounted(() => {
      $books.setPage(1);
      getBooks()
    });
    const userData = computed(() => $auth.userData);

    const {getBooks, skeleton} = useBooks()

    const changePage = () => {
      getBooks()
    }

    const selectCategory = (cat:any) => {
      $books.selectCategory(cat)
      getBooks()
    }

    const clearCategory = () => {
      $books.clearCategory()
      getBooks()
    }

    return {
      user,
      userData,
      optionList,
      books,
      skeleton,
      parameters,
      categories,
      selectedCategory,
      bookId,
      users,
      categoryForm,
      bookForm,
      changePage,
      selectCategory,
      clearCategory,
    }
  }
})
</script>

<style scoped>

</style>
