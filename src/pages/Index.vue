<template>
  <q-page>
    <div class="row full-height flex">
      <div class="col-md-7 bg-grey-3" style="height:94vh" v-if="$q.screen.gt.sm">
        <div class="row flex flex-center items-center" style="height:90vh">
          <q-card class="bg-transparent" flat>
            <img src="/img/library.png" alt="desk" />
          </q-card>
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-5 bg-grey-1">
        <div class="row flex flex-center" style="height:94vh">
          <q-card flat class="bg-transparent full-width" :class="$q.screen.gt.sm ? 'q-px-xl':''">
            <q-toolbar>
              <q-toolbar-title class="text-center">
                <img src="/logos/logo-title.png" alt="GoVita" style="height:60px">
              </q-toolbar-title>
            </q-toolbar>
            <q-card-section class="flex flex-center">
              <q-spinner
                color="primary"
                size="10em"
                :thickness="2"
              />
            </q-card-section>
            <q-card-section>
              <div class="text-center text-h6">
                {{ stat }}
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import {ref, onMounted} from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/auth'
import { useMeta,LocalStorage } from 'quasar'
import { axios } from 'src/boot/axios';

const metaData = {
  // sets document title
  title: `Inicio | ${process.env.TITLE}`,
  // optional; sets final title as "Index Page - My Website", useful for multiple level meta
  titleTemplate: title => `${title}`,
  // meta tags
  meta: {
    description: { name: 'description', content: 'Library software' },
    keywords: { name: 'keywords', content: 'library, admin' },
    equiv: { 'http-equiv': 'Content-Type', content: 'text/html; charset=UTF-8' },
    // note: for Open Graph type metadata you will need to use SSR, to ensure page is rendered by the server
    ogTitle:  {
      property: 'og:title',
      // optional; similar to titleTemplate, but allows templating with other meta properties
      template (ogTitle) {
        return `${ogTitle} - Library`
      }
    }
  },
  // <noscript> tags
  noscript: {
    default: 'Library software'
  }
}
export default {
  setup () {
    useMeta(metaData);
    const stat = ref('Verifying connection...')
    const $router = useRouter()
    const $auth = useAuthStore()

    onMounted(() => {
      setTimeout(() => {
        stat.value = 'Validating account...'
        Init();
      }, 1000);
    })

    const Init = () => {
      setTimeout(async() => {
        const token = LocalStorage.getItem("token");
        if (!token) {
          $router.replace({name:'Login'});
          return;
        }
        axios.post(`${process.env.API}/auth/refresh-token`)
        .then(res => {
          $auth.signIn(res.data.token)
          $router.replace({name:'Admin'})
        })
        .catch(() => {
          $auth.logOut()
          $router.replace({name:'Login'})
        })
      }, 1000);
    }

    return {stat}
  }
}
</script>

<style lang="scss" scoped>

</style>
