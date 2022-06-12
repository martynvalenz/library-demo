import { useBookStore } from 'src/stores/books';
import { defineStore } from 'pinia';
import { Book } from 'src/components/models';

export const useCartStore = defineStore('cart', {
  state: () => ({
    loans:Array<Book>(),
    cart:Array<Book>(),
    favorites: Array<Book>(),
  }),
  getters: {
    getCart: (state) => {
      return state.cart;
    },
    getLoans: (state) => {
      const books = useBookStore()
      let loans:Array<Book> = [];
      state.loans.forEach(loan => {
        const findCategory = books.getCategories.find(cat => cat.id === loan.categoryId?._id);
        Object.assign(loan,{category:{category:findCategory?.category,id:findCategory?.id}})
        loans.push(loan);
      })
      return loans;
    },
    getFavorites: (state) => {
      const books = useBookStore()
      let favorites:Array<Book> = [];
      state.favorites.forEach(fav => {
        const findCategory = books.categories.find(cat => cat.id === fav.categoryId);
        Object.assign(fav,{category:{category:findCategory?.category,id:findCategory?.id}})
        favorites.push(fav);
      })
      return favorites;
    },
  },
  actions: {
    setCart(data:any){
      this.cart = [];
      data.forEach((book:Book) => {
        this.cart.push(book);
      })
    },

    addToCart(data:any){
      this.cart.push(data)
    },

    clearCart(){
      this.cart = [];
    },

    removeFromCart(bookId:string){
      const index = this.cart.findIndex(book => book.id === bookId);
      this.cart.splice(index,1);
    },

    setFavorites(data:any){
      this.favorites = [];
      data.forEach((favorite:any) =>{
        Object.assign(favorite.bookId,{id:favorite.bookId._id})
        this.favorites.push(favorite.bookId);
      })
    },

    pushFavorite(data:Book){
      this.favorites.push(data);
    },

    removeFromFavorites(id:string){
      const index = this.favorites.findIndex(fav => fav.id === id);
      this.favorites.splice(index,1);
    },

    setLoans(data:any){
      this.loans = [];
      data.forEach((loan:any) =>{
        this.loans.push(loan);
      })
    },

    loanBooks(data:any){
      data.forEach((book:Book) => {
        this.cart.splice(this.cart.findIndex(obj => obj.id === book.id),1);
        this.loans.push(book);
      });
    },

    removeFromLoans(index:number){
      this.loans.splice(index,1);
    },

    removeAllFromLoans(){
      this.loans = []
    }
  },
});
