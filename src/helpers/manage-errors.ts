import {Notify} from 'quasar'

export function manageErrors(error:any) {
  let msg = '';

  if(error.response.status == 400){
    msg = error.response.data.msg;
  }
  else if(error.response.status == 404){
    msg = error.response.data.msg;
  }
  else if(error.response.status == 422){
    msg = 'Data cannot be saved, please check your data.';
  }
  else if(error.response.status == 401){
    msg = error.response.data.msg;
  }
  else if(error.response.status == 429){
    msg = 'Too many login attempts, wait 3 minutes and try again'
  }
  else if(error.response.status == 413){
    msg = 'File size is too big, please upload a smaller file.'
  }
  else if(error.response.status == 500){
    msg = error.response.data.msg;
  }

  Notify.create({
    message:msg,
    color:'negative',
    position:'bottom',
    actions: [
      { label: 'Cerrar', color: 'white', handler: () => {  } }
    ]
  })
}
