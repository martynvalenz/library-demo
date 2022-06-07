<template>
  <q-card :style="$q.screen.gt.sm ? {'width':'450px'}:''">
    <q-toolbar>
      <q-toolbar-title>Categories</q-toolbar-title>
      <q-space></q-space>
      <q-btn flat round dense icon="close" v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <div class="row">
        <div class="col-xs-12">
          <q-input v-model.trim="category" outlined label="Category Name">
            <template v-slot:after>
              <q-btn round icon="add" dense color="positive" :disable="category.length === 0" @click="addCategory()" :loading="loading">
                <q-tooltip>Add category</q-tooltip>
              </q-btn>
            </template>
          </q-input>
          <div class="text-subtitle2 text-red" v-for="error in errors.category" :key="error">
            {{error}}
          </div>
        </div>
      </div>
    </q-card-section>
    <q-list v-if="categories.length > 0" bordered separator>
      <q-item v-for="cat in categories" :key="cat.id">
        <q-item-section>
          <q-item-label caption>Category</q-item-label>
          <q-item-label>
            {{cat.category}} <q-icon color="orange" name="edit"></q-icon>
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-item-label caption>Books</q-item-label>
          <q-item-section>{{cat.books}}</q-item-section>
        </q-item-section>
      </q-item>
    </q-list>
  </q-card>
</template>

<script lang="ts">
import {axios} from 'src/boot/axios'
import { manageErrors } from 'src/helpers/manage-errors'
import { useBookStore } from 'src/stores/books'
import { defineComponent, computed, ref } from 'vue'

export default defineComponent({
  setup () {
    const $books = useBookStore()
    const category = ref('')
    const loading = ref(false)
    const categories = computed(() => $books.getCategories)
    const errors = ref({
      category:''
    })

    const addCategory = () => {
      loading.value = true;
      axios.post(`${process.env.API}/categories/create`, {
        category: category.value
      })
      .then(async (res: any) => {
        loading.value = false;
        $books.addCategory(res.data.category)
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

    return {
      loading,
      category,
      categories,
      errors,
      addCategory,
    }
  }
})
</script>

<style scoped>

</style>
