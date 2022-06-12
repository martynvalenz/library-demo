import { axios } from "src/boot/axios";
import { useBookStore } from "src/stores/books";
import { computed, ref } from "vue";

export function useBooks() {
  const $books = useBookStore();
  const parameters = computed(() => $books.parameters);
  const selectedCategory = computed(() => $books.selectedCategory);
  const skeleton = ref(true);

  const getBooks = () => {
    skeleton.value = true;
    axios.post(`${process.env.API}/books`,{
      category:selectedCategory.value.id,
      page:parameters.value.page,
      limit:9,
    })
    .then(res => {
      $books.setBooks(res.data.results);
      skeleton.value = false;
    })
    .catch(error => {
      console.log(error);
      skeleton.value = false;
    })
  }

  const getBooksAdmin = () => {
    skeleton.value = true;
    axios.post(`${process.env.API}/books/admins`,{
      page:parameters.value.page,
      limit:9,
    })
    .then(res => {
      $books.setBooks(res.data.results);
      skeleton.value = false;
    })
    .catch(error => {
      console.log(error);
      skeleton.value = false;
    })
  }

  return {
    getBooksAdmin,
    getBooks,
    skeleton,
  }
}
