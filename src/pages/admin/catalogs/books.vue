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
          <q-card-section class="q-pa-sm" v-if="books.length > 0">
            <div class="row">
              <div class="col-xs-12 col-sm-6 col-md-4 q-pa-xs" v-for="book in books" :key="book.id">
                <q-card>
                  <q-card-section horizontal>
                    <q-img
                      :class="$q.screen.xs ? 'col-5':'col-4'"
                      :src="book.coverImage"
                      contain
                    >
                    </q-img>
                    <q-list :class="$q.screen.xs ? 'col-7':'col-8'">
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
                          <q-btn icon="shopping_cart" class="q-px-sm" dense color="primary" :disable="book.stock === 0">
                            <q-tooltip>Add to cart</q-tooltip>
                          </q-btn>
                          <q-btn icon="thumb_up" class="q-px-sm" dense color="secondary">
                            <q-tooltip>Add to favorites</q-tooltip>
                          </q-btn>
                          <q-btn icon="edit" class="q-px-sm" dense color="warning" v-if="userData.role === 'Admin'">
                            <q-tooltip>Edit book</q-tooltip>
                          </q-btn>
                        </div>
                      </q-item>
                    </q-list>
                  </q-card-section>
                </q-card>
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
      <BookForm/>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { LocalStorage, useMeta } from 'quasar';
import { useBookStore } from 'src/stores/books';
import { computed, defineComponent,onMounted,ref } from 'vue'
import CategoryForm from 'src/components/Dialogs/CategoryForm.vue';
import BookForm from 'src/components/Dialogs/BookForm.vue';
import { useAuthStore } from 'src/stores/auth';

export default defineComponent({
  name: 'Catalogs',
  components: {
    CategoryForm,
    BookForm
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

    onMounted(() => {
      optionList.value = LocalStorage.getItem('optionList') || 'list';
    });

    const userData = computed(() => $auth.userData);

    const createCategory = () => {
      categoryForm.value = true
    }

    const createBook = () => {
      bookForm.value = true
    }

    return {
      user,
      userData,
      optionList,
      books,
      categoryForm,
      bookForm,
      createCategory,
      createBook
    }
  }
})
</script>

<style scoped>

</style>
