import {
  Notify
} from 'quasar'

export function notification(message:string,color:string) {
  // if(color == 'negative'){
  //   const audio = '/audios/error.mp3'
  //   const bell = new Audio(audio);
  //   bell.play();
  // }
  // else if(color == 'positive'){
  //   const audio = '/audios/noti.mp3'
  //   const bell = new Audio(audio);
  //   bell.play();
  // }

  Notify.create({
    message:message,
    color:color,
    actions: [
      { label: 'Close', color: 'white', handler: () => { /* ... */ } }
    ]
  })
}