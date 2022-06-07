import { LocalStorage } from 'quasar';

const optionList = LocalStorage.getItem('optionList')

if(!optionList){
  LocalStorage.set('optionList','list');
}
