import { defineStore } from 'pinia';
import { Book, Category } from 'src/components/models';

export const useBookStore = defineStore('books', {
  state: () => ({
    books: Array<Book>(),
    categories: Array<Category>(),
  }),
  getters: {
    getBooks: (state) => state.books,
    getCategories: (state) => state.categories,
    getActiveCategories: (state) => state.categories.filter(category => category.isActive),
  },
  actions: {
    addCategory(category: Category) {
      this.categories.unshift(category);
    },

    setCategories(categories: Category[]) {
      this.categories = categories;
    },

    setBooks(books: Book[]) {
      this.books = books;
    },

    storeBook(book: Book) {
      this.books.push(book);
      const index = this.categories.findIndex(cat => cat.id === book.categoryId._id);
      this.categories[index].books ++;
    }
  },
});
