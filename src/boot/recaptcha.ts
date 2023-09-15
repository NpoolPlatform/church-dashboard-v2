import { boot } from 'quasar/wrappers'
import { VueReCaptcha } from 'vue-recaptcha-v3'
import { constant } from 'src/npoolstore'

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(({ app }) => {
  // something to do
  app.use(VueReCaptcha, { siteKey: constant.GoogleRecaptchaKey })
})
