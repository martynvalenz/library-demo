import {
  Dialog
} from 'quasar'

export const confirmMessage = (title:string,message:string) => {
   Dialog.create({
      title,
      message
   })
}