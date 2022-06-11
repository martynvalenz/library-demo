import { defineStore } from 'pinia';
import { Book, Category } from 'src/components/models';

export const useBookStore = defineStore('books', {
  state: () => ({
    books: Array<Book>(),
    categories: Array<Category>(),
    parameters:{
      totalDocs: 0,
      offset: 0,
      limit: 9,
      totalPages: 0,
      page: 1,
      pagingCounter: 0,
      hasPrevPage: false,
      hasNextPage: true,
      prevPage: null,
      nextPage: 0
    }
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

    setBooks(data: any) {
      this.books = data.docs;
      this.parameters.totalPages = data.totalPages;
      this.parameters.page = data.page;
    },

    storeBook(book: Book) {
      this.books.push(book);
      const index = this.categories.findIndex(cat => cat.id === book.categoryId._id);
      this.categories[index].books ++;
    },

    updateBook(book: Book) {
      const index = this.books.findIndex(b => b.id === book.id);
      this.books[index] = book;
    }
  },
});
