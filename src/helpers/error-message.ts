import {
  Dialog
} from 'quasar'

export function showErrorMessage(error:any) {

  let msg = '';

  if(error.response.status == 400){
    msg = error.response.data.msg;
  }
  else if(error.response.status == 404){
    msg = error.response.data.msg;
  }
  else if(error.response.status == 401){
    msg = error.response.data.msg;
  }
  else if(error.response.status == 429){
    msg = 'Too many login attempts, wait 3 minutes and try again.'
  }
  else if(error.response.status == 500){
    msg = error.response.data.msg;
  }
  Dialog.create({
      title: 'Error',
      message: msg
  })
}
