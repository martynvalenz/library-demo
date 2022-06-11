import { useQuasar } from "quasar";
import { axios } from "src/boot/axios";
import { useBookStore } from "src/stores/books";
import { computed } from "vue";

export function useBooks() {
  const $books = useBookStore();
  const parameters = computed(() => $books.parameters);
  const $q = useQuasar()

  const getBooks = () => {
    $q.loading.show();
    axios.post(`${process.env.API}/books`,{
      search:'',
      page:parameters.value.page,
      limit:9,
    })
    .then(res => {
      $books.setBooks(res.data.results);
      $q.loading.hide();
    })
  }

  return {
    getBooks
  }
}
