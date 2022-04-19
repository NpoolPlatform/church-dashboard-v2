import { RouteRecordRaw } from 'vue-router'
import { RouteMetaImpl } from 'npool-cli-v2/utils'

declare module 'vue-router' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface RouteMeta extends RouteMetaImpl {
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Index.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true
        }
      }, {
        path: 'signin',
        component: () => import('pages/Signin.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: false
        }
      }, {
        path: 'email/template',
        component: () => import('pages/template/Email.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true
        }
      }, {
        path: 'sms/template',
        component: () => import('pages/template/SMS.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true
        }
      }, {
        path: 'contact/template',
        component: () => import('pages/template/Contact.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true
        }
      }, {
        path: 'app/languages',
        component: () => import('pages/internationalization/Language.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true
        }
      }, {
        path: 'app/messages',
        component: () => import('pages/internationalization/Message.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true
        }
      }, {
        path: 'countries',
        component: () => import('pages/internationalization/Country.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true
        }
      }, {
        path: 'app/goods',
        component: () => import('src/pages/good/AppGood.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true
        }
      }, {
        path: 'app/good/promotions',
        component: () => import('pages/good/Promotion.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true
        }
      }, {
        path: 'app/good/recommends',
        component: () => import('pages/good/Recommend.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true
        }
      }, {
        path: 'review/kyc',
        component: () => import('pages/review/KYC.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true
        }
      }, {
        path: 'review/withdraw/address',
        component: () => import('pages/review/WithdrawAddress.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true
        }
      }, {
        path: 'review/withdraw',
        component: () => import('pages/review/Withdraw.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true
        }
      }, {
        path: 'review/payment',
        component: () => import('pages/review/Payment.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true
        }
      }, {
        path: 'users',
        component: () => import('pages/user/User.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true
        }
      }, {
        path: 'roles',
        component: () => import('pages/user/Role.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true
        }
      }, {
        path: 'roleusers',
        component: () => import('pages/user/RoleUser.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true
        }
      }, {
        path: 'inspire/invitation/code',
        component: () => import('pages/inspire/InvitationCode.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true
        }
      }, {
        path: 'inspire/commission',
        component: () => import('pages/inspire/Commission.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true
        }
      }, {
        path: 'auth/app',
        component: () => import('pages/auth/App.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true
        }
      }, {
        path: 'auth/user',
        component: () => import('pages/auth/User.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true
        }
      }, {
        path: 'auth/role',
        component: () => import('pages/auth/Role.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true
        }
      }, {
        path: 'auth/batch',
        component: () => import('pages/auth/Batch.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true
        }
      }, {
        path: 'application',
        component: () => import('pages/application/Application.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true
        }
      }, {
        path: 'languages',
        component: () => import('pages/internationalization/Languages.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true
        }
      }, {
        path: 'coins',
        component: () => import('pages/coin/CoinInfo.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true
        }
      }, {
        path: 'coin/descriptions',
        component: () => import('pages/coin/Description.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true
        }
      }, {
        path: 'supply/devices',
        component: () => import('pages/supply/Device.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true
        }
      }, {
        path: 'supply/vendorlocations',
        component: () => import('pages/supply/VendorLocation.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true
        }
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
