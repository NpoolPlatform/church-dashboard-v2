import { uid } from 'quasar'
import { MenuItem } from 'src/localstore'

const MainDrawerMenus = [
  {
    menuId: uid(),
    label: '应用',
    caption: '管理应用',
    icon: 'pending',
    target: '/application',
    level: 0,
    sectionBegin: false,
    children: []
  } as MenuItem, {
    menuId: uid(),
    label: '币种',
    caption: '币种管理',
    icon: 'pending',
    target: '/coins',
    level: 0,
    sectionBegin: false,
    children: [
      {
        menuId: uid(),
        label: '币种',
        caption: '管理币种|收益估算',
        icon: 'pending',
        target: '/coins',
        level: 0,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '币种描述',
        caption: '管理币种描述',
        icon: 'pending',
        target: '/coin/descriptions',
        level: 0,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '法币',
        caption: '管理法币类型',
        icon: 'pending',
        target: '/fiat/type',
        level: 0,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '币种汇率源',
        caption: '管理币种汇率源',
        icon: 'pending',
        target: '/coin/coinfeed',
        level: 0,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '法币管理',
        caption: '管理法币',
        icon: 'pending',
        target: '/coin/fiat',
        level: 0,
        sectionBegin: false,
        children: []
      } as MenuItem
    ]
  } as MenuItem, {
    menuId: uid(),
    label: '模板',
    caption: '管理应用模板',
    icon: 'pending',
    target: '/application',
    level: 0,
    sectionBegin: false,
    children: [
      {
        menuId: uid(),
        label: '应用短信模板',
        caption: '管理应用短信模板',
        icon: 'perm_identity',
        target: '/sms/template',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '应用邮件模板',
        caption: '管理应用邮件模板',
        icon: 'perm_identity',
        target: '/email/template',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '应用内联系',
        caption: '管理应用内联系地址',
        icon: 'perm_identity',
        target: '/contact/template',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '前端通知模版',
        caption: '管理前端通知模版',
        icon: 'perm_identity',
        target: '/notif/template',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem
    ]
  } as MenuItem, {
    menuId: uid(),
    label: '账户管理',
    caption: '管理购买、提现出入金账户',
    icon: 'pending',
    target: '/account',
    level: 0,
    sectionBegin: false,
    children: [
      {
        menuId: uid(),
        label: '平台入金归集地址',
        caption: '管理平台入金归集地址',
        icon: 'perm_identity',
        target: '/account/platform/collector',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '用户冷钱包',
        caption: '用户收益部分离线管理地址',
        icon: 'perm_identity',
        target: '/account/user/cold',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '用户热钱包',
        caption: '用户提现出金地址',
        icon: 'perm_identity',
        target: '/account/user/hot',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '商品收益地址',
        caption: '管理商品收益地址',
        icon: 'perm_identity',
        target: '/account/benefit',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '平台冷钱包',
        caption: '平台收益部分离线管理地址',
        icon: 'perm_identity',
        target: '/account/platform',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '商品购买支付地址',
        caption: '管理商品购买支付地址',
        icon: 'perm_identity',
        target: '/account/payment',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '手续费供应地址',
        caption: '管理手续费供应地址',
        icon: 'perm_identity',
        target: '/account/gasfeeder',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '用户提现地址',
        caption: '用户提现地址',
        icon: 'perm_identity',
        target: '/account/withdraw',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '用户直接收益地址',
        caption: '用户直接从商品获取收益的地址',
        icon: 'perm_identity',
        target: '/account/directbenefit',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem
    ]
  } as MenuItem, {
    menuId: uid(),
    label: '公告与渠道',
    caption: '管理公告与通知渠道',
    icon: 'pending',
    target: '/notification',
    level: 0,
    sectionBegin: false,
    children: [
      {
        menuId: uid(),
        label: '公告',
        caption: '管理应用公告',
        icon: 'perm_identity',
        target: '/announcement',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, /* {
        menuId: uid(),
        label: '通知',
        caption: '管理通知',
        icon: 'perm_identity',
        target: '/announcement/state',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, *//* {
        menuId: uid(),
        label: '通知',
        caption: '管理应用内用户通知',
        icon: 'perm_identity',
        target: '/notification',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '站内信',
        caption: '管理应用站内信',
        icon: 'perm_identity',
        target: '/mail',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem */ {
        menuId: uid(),
        label: '渠道',
        caption: '管理通知渠道',
        icon: 'perm_identity',
        target: '/announcement/channel',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem
    ]
  } as MenuItem, {
    menuId: uid(),
    label: '国际化',
    caption: '管理应用语言包',
    icon: 'perm_identity',
    target: '/languages',
    level: 1,
    sectionBegin: false,
    children: [
      {
        menuId: uid(),
        label: '语言列表',
        caption: '管理语言列表',
        icon: 'perm_identity',
        target: '/languages',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '国家列表',
        caption: '管理国家列表',
        icon: 'perm_identity',
        target: '/countries',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '应用文案',
        caption: '管理应用文案',
        icon: 'perm_identity',
        target: '/app/messages',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem
    ]
  } as MenuItem, {
    menuId: uid(),
    label: '商品',
    caption: '应用内商品定价与上下架',
    icon: 'perm_identity',
    target: '/app/good',
    level: 1,
    sectionBegin: false,
    children: [{
      menuId: uid(),
      label: '商品管理',
      caption: '添加与编辑商品',
      icon: 'perm_identity',
      target: '/app/good/goods',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, /* {
      menuId: uid(),
      label: '库存',
      caption: '管理与展示商品库存',
      icon: 'perm_identity',
      target: '/stock',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, */ {
      menuId: uid(),
      label: 'APP商品管理',
      caption: '授权、价格与上下架管理',
      icon: 'perm_identity',
      target: '/app/good/appgoods',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '推荐',
      caption: '添加商品推荐',
      icon: 'perm_identity',
      target: '/app/good/recommends',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '促销',
      caption: '管理促销信息',
      icon: 'perm_identity',
      target: '/app/good/promotions',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem]
  } as MenuItem, {
    menuId: uid(),
    label: '供应链',
    caption: '管理商品供应链关系',
    icon: 'perm_identity',
    target: '/supply',
    level: 1,
    sectionBegin: false,
    children: [
      {
        menuId: uid(),
        label: '设备',
        caption: '管理设备型号',
        icon: 'perm_identity',
        target: '/supply/devices',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '场地',
        caption: '管理托管场地',
        icon: 'perm_identity',
        target: '/supply/vendorlocations',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem
    ]
  } as MenuItem, /* {
    menuId: uid(),
    label: '服务费',
    caption: '管理商品服务费',
    icon: 'perm_identity',
    target: '/fee',
    level: 1,
    sectionBegin: false,
    children: [
      {
        menuId: uid(),
        label: '费用类型',
        caption: '管理费用类型',
        icon: 'perm_identity',
        target: '/fee/feetypes',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '费用',
        caption: '定义具体费用',
        icon: 'perm_identity',
        target: '/fee/fees',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem
    ]
  } as MenuItem, */ {
    menuId: uid(),
    label: '审核',
    caption: '管理审核项目',
    icon: 'reviews',
    target: '/review',
    level: 0,
    sectionBegin: false,
    children: [
      {
        menuId: uid(),
        label: 'KYC',
        caption: '管理身份审核',
        icon: 'perm_identity',
        target: '/review/kyc',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, /* {
        menuId: uid(),
        label: '提现地址',
        caption: '审核体现地址设置',
        icon: 'format_list_numbered',
        target: '/review/withdraw/address',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, */{
        menuId: uid(),
        label: '提现请求',
        caption: '审核提现请求',
        icon: 'format_list_numbered',
        target: '/review/withdraw',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem
    ]
  } as MenuItem, {
    menuId: uid(),
    label: '用户与角色',
    caption: '管理用户和角色',
    icon: 'reviews',
    target: '/users',
    level: 0,
    sectionBegin: false,
    children: [
      {
        menuId: uid(),
        label: '用户列表',
        caption: '查看全部用户',
        icon: 'format_list_numbered',
        target: '/users',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '角色列表',
        caption: '查看全部角色',
        icon: 'format_list_numbered',
        target: '/roles',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '角色用户',
        caption: '管理角色用户',
        icon: 'format_list_numbered',
        target: '/roleusers',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem
    ]
  } as MenuItem, {
    menuId: uid(),
    label: '授权管理',
    caption: '管理资源授权',
    icon: 'reviews',
    target: '/auth',
    level: 0,
    sectionBegin: false,
    children: [
      {
        menuId: uid(),
        label: '授权给APP',
        caption: '将资源授权给选定APP',
        icon: 'format_list_numbered',
        target: '/auth/app',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '授权给角色',
        caption: '将资源授权给APP内角色',
        icon: 'format_list_numbered',
        target: '/auth/role',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '授权给用户',
        caption: '将资源授权给APP内特定用户',
        icon: 'format_list_numbered',
        target: '/auth/user',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '批量管理',
        caption: '批量导入导出授权',
        icon: 'format_list_numbered',
        target: '/auth/batch',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem
    ]
  } as MenuItem, {
    menuId: uid(),
    label: '激励体系',
    caption: '管理邀请码、代金券',
    icon: 'format_list_numbered',
    target: '/inspire/invitation/code',
    level: 0,
    sectionBegin: false,
    children: [{
      menuId: uid(),
      label: '邀请码',
      caption: '管理用户邀请码',
      icon: 'format_list_numbered',
      target: '/inspire/invitation/code',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '活动',
      caption: '管理APP活动',
      icon: 'format_list_numbered',
      target: '/inspire/activity',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '定额券',
      caption: '管理定额代金券',
      icon: 'format_list_numbered',
      target: '/inspire/fixamount',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '折扣券',
      caption: '管理折扣代金券',
      icon: 'format_list_numbered',
      target: '/inspire/discount',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '用户定向券',
      caption: '管理定向用户代金券',
      icon: 'format_list_numbered',
      target: '/inspire/special/offer',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '事件',
      caption: '管理自动触发发券事件',
      icon: 'format_list_numbered',
      target: '/inspire/event/coupon',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '空投',
      caption: '给指定用户空投代金券',
      icon: 'format_list_numbered',
      target: '/inspire/airdrop',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '用户的券',
      caption: '查看用户持有代金券',
      icon: 'format_list_numbered',
      target: '/inspire/user/coupon',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '邀请关系',
      caption: '查看用户邀请关系',
      icon: 'format_list_numbered',
      target: '/inspire/registration',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem]
  } as MenuItem, {
    menuId: uid(),
    label: '报表和账单',
    caption: '收入、支出统计',
    icon: 'format_list_numbered',
    target: '/billing',
    level: 0,
    sectionBegin: false,
    children: [{
      menuId: uid(),
      label: '订单',
      caption: '查看订单列表',
      icon: 'format_list_numbered',
      target: '/billing/order',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '提现支出',
      caption: '用户提现支出',
      icon: 'format_list_numbered',
      target: '/billing/withdraw',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '采购支出',
      caption: '算力采购支出',
      icon: 'format_list_numbered',
      target: '/billing/purchase',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '转账',
      caption: '平台内转账记录',
      icon: 'format_list_numbered',
      target: '/billing/transaction',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem]
  } as MenuItem, {
    menuId: uid(),
    label: '用户订阅',
    caption: '查看用户订阅',
    icon: 'reviews',
    target: '/subscribe',
    level: 0,
    sectionBegin: false,
    children: [
      {
        menuId: uid(),
        label: '邮件订阅',
        caption: '查看邮件订阅用户',
        icon: 'format_list_numbered',
        target: '/subscribe/email',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem
    ]
  } as MenuItem, {
    menuId: uid(),
    label: '订单管理',
    caption: '查看订单以及创建离线订单',
    icon: 'reviews',
    target: '/order',
    level: 0,
    sectionBegin: false,
    children: [
      {
        menuId: uid(),
        label: '订单列表',
        caption: '查看订单列表',
        icon: 'format_list_numbered',
        target: '/billing/order',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '离线订单',
        caption: '创建离线订单',
        icon: 'format_list_numbered',
        target: '/order/offline',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem
    ]
  } as MenuItem, {
    menuId: uid(),
    label: '余额充值',
    caption: '余额充值',
    icon: 'reviews',
    target: '/deposit',
    level: 0,
    sectionBegin: false,
    children: [
      {
        menuId: uid(),
        label: '余额充值',
        caption: '余额充值列表',
        icon: 'format_list_numbered',
        target: '/deposit/balance',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem
    ]
  } as MenuItem
] as Array<MenuItem>

export {
  MainDrawerMenus
}
