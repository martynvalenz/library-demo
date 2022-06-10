<template>
  <q-card :style="$q.screen.gt.sm ? {'width':'450px'}:''">
    <q-toolbar>
      <q-toolbar-title>Book</q-toolbar-title>
      <q-space></q-space>
      <q-btn flat round dense icon="close" v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <div class="row">
        <div class="col-xs-12 q-pa-xs">
          <q-input v-model.trim="book.title" outlined label="Title">
            <template v-slot:prepend>
              <q-icon name="menu_book"></q-icon>
            </template>
          </q-input>
          <div class="text-subtitle2 text-red" v-for="error in errors.title" :key="error">
            {{error}}
          </div>
        </div>
        <div class="col-xs-12 q-pa-xs">
          <q-input v-model.trim="book.author" outlined label="Author">
            <template v-slot:prepend>
              <q-icon name="person"></q-icon>
            </template>
          </q-input>
          <div class="text-subtitle2 text-red" v-for="error in errors.author" :key="error">
            {{error}}
          </div>
        </div>
        <div class="col-xs-12 q-pa-xs">
          <q-input v-model.trim="book.coverImage" outlined label="Cover Image" type="textarea" autogrow rows="1">
            <template v-slot:prepend>
              <q-icon name="image"></q-icon>
            </template>
          </q-input>
          <div class="text-subtitle2 text-red" v-for="error in errors.coverImage" :key="error">
            {{error}}
          </div>
        </div>
        <div class="col-xs-12 q-pa-xs">
          <q-select
            v-model="book.categoryId"
            class="full-width"
            label="Category"
            emit-value
            map-options
            :options="categories"
            outlined
            option-value="id"
            option-label="category"
          />
          <div class="text-subtitle2 text-red" v-for="error in errors.categoryId" :key="error">
            {{error}}
          </div>
        </div>
        <div class="col-xs-6 q-pa-xs">
          <q-input v-model.trim="book.year" outlined label="Year" type="number" min="0">
          </q-input>
          <div class="text-subtitle2 text-red" v-for="error in errors.year" :key="error">
            {{error}}
          </div>
        </div>
        <div class="col-xs-6 q-pa-xs">
          <q-input v-model.trim="book.stock" outlined label="Stock" type="number" min="0">
          </q-input>
          <div class="text-subtitle2 text-red" v-for="error in errors.stock" :key="error">
            {{error}}
          </div>
        </div>
      </div>
      <div class="row q-pa-xs">
        <q-btn
          class="full-width"
          color="primary"
          icon-right="save"
          label="Save Book"
          no-caps
          @click="storeCategory()"
          :loading="loading"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import {axios} from 'src/boot/axios'
import { manageErrors } from 'src/helpers/manage-errors'
import { notification } from 'src/helpers/notify'
import { useBookStore } from 'src/stores/books'
import { defineComponent,ref,computed, onMounted } from 'vue'

export default defineComponent({
  props:{
    bookId:{
      type:String
    },
    action:{
      type:String,
      required:true
    },
  },

  setup (props,{emit}) {
    const $books = useBookStore()
    const loading = ref(false)
    const book = ref({
      title:'',
      author:'',
      coverImage:'',
      year:'',
      stock:0,
      categoryId:'',
    })

    const errors = ref({
      title:'',
      author:'',
      coverImage:'',
      year:'',
      stock:'',
      categoryId:'',
    })

    const categories = computed(() => $books.getActiveCategories);

    const clearBook = () => {
      book.value.title = ''
      book.value.author = ''
      book.value.coverImage = ''
      book.value.year = ''
      book.value.stock = 0
    }

    const clearErrors = () => {
      errors.value.title = ''
      errors.value.author = ''
      errors.value.coverImage = ''
      errors.value.year = ''
      errors.value.stock = ''
    }

    const storeCategory = () => {
      loading.value = true;
      if(props.bookId){
        axios.put(`${process.env.API}/books/update/${props.bookId}`, book.value)
        .then(async (res: any) => {
          loading.value = false;
          $books.updateBook(res.data.book)
          clearBook()
          clearErrors()
          notification('Book updated successfully','positive');
          emit('closeBookDialog');
        })
        .catch((error:any) => {
          console.log(error);
          loading.value = false;
          if (error.response.data.errors) {
            errors.value = error.response.data.errors;
          }
          manageErrors(error);
        });
      }
      else{
        axios.post(`${process.env.API}/books/store`, book.value)
        .then(async (res: any) => {
          loading.value = false;
          $books.storeBook(res.data.book)
          clearBook()
          clearErrors()
          notification('Book created successfully','positive')
        })
        .catch((error:any) => {
          console.log(error);
          loading.value = false;
          if (error.response.data.errors) {
            errors.value = error.response.data.errors;
          }
          manageErrors(error);
        });
      }
    }

    onMounted(() => {
      if(props.action === 'edit') {
        editBook()
        clearErrors()
      }
      else{
        clearErrors()
      }
    })

    const editBook = () => {
      axios.get(`${process.env.API}/books/${props.bookId}`)
      .then((res: any) => {
        book.value = res.data.book
      })
      .catch((error:any) => {
        console.log(error);
        manageErrors(error);
      });
    }

    return {
      book,
      loading,
      errors,
      categories,
      storeCategory,
    }
  }
})
</script>

<style scoped>

</style>
