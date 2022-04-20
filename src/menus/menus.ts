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
        caption: '添加、删除与修改',
        icon: 'pending',
        target: '/coins',
        level: 0,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '币种描述',
        caption: '为币种添加描述',
        icon: 'pending',
        target: '/coin/descriptions',
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
      } as MenuItem
    ]
  } as MenuItem, {
    menuId: uid(),
    label: '出入金地址 *',
    caption: '管理购买、提现出入金地址',
    icon: 'pending',
    target: '/account',
    level: 0,
    sectionBegin: false,
    children: [
      {
        menuId: uid(),
        label: '平台收益地址',
        caption: '管理平台收益地址',
        icon: 'perm_identity',
        target: '/account/benefit',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '平台冷钱包',
        caption: '平台收益冷钱包',
        icon: 'perm_identity',
        target: '/account/platform',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '用户冷钱包',
        caption: '用户收益冷钱包',
        icon: 'perm_identity',
        target: '/account/usercold',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '用户热钱包',
        caption: '用户收益热钱包',
        icon: 'perm_identity',
        target: '/account/userwarm',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '支付资金地址',
        caption: '支付金额资金管理地址',
        icon: 'perm_identity',
        target: '/account/incoming',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '支付地址',
        caption: '购买支付转账地址',
        icon: 'perm_identity',
        target: '/account/payment',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '提现地址',
        caption: '用户提现地址',
        icon: 'perm_identity',
        target: '/account/withdraw',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem
    ]
  } as MenuItem, {
    menuId: uid(),
    label: '公告与通知',
    caption: '管理公告与通知',
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
      } as MenuItem, {
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
      } as MenuItem
    ]
  } as MenuItem, {
    menuId: uid(),
    label: '限额设置 *',
    caption: '管理公告与通知',
    icon: 'pending',
    target: '/limits',
    level: 0,
    sectionBegin: false,
    children: [
      {
        menuId: uid(),
        label: '用户热钱包限额',
        caption: '管理用户出金地址限额',
        icon: 'perm_identity',
        target: '/limits/userwarm',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '支付划转限额',
        caption: '设置支付地址划转限额',
        icon: 'perm_identity',
        target: '/limits/payment',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '提现自动审核限额',
        caption: '管理应用站内信',
        icon: 'perm_identity',
        target: '/limits/withdraw',
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
        label: '国际化语言列表',
        caption: '管理全局国际化语言列表',
        icon: 'perm_identity',
        target: '/languages',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: 'APP语言设置',
        caption: '管理应用支持语言',
        icon: 'perm_identity',
        target: '/app/languages',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '语言包管理',
        caption: '管理应用文案',
        icon: 'perm_identity',
        target: '/app/messages',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '国家列表',
        caption: '查看国家列表',
        icon: 'perm_identity',
        target: '/countries',
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
    target: '/app/goods',
    level: 1,
    sectionBegin: false,
    children: [{
      menuId: uid(),
      label: '商品管理',
      caption: '添加与编辑商品',
      icon: 'perm_identity',
      target: '/goods',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: 'APP商品管理',
      caption: '授权、价格与上下架管理',
      icon: 'perm_identity',
      target: '/app/goods',
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
  } as MenuItem, {
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
  } as MenuItem, {
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
      } as MenuItem, {
        menuId: uid(),
        label: '提现地址',
        caption: '审核体现地址设置',
        icon: 'format_list_numbered',
        target: '/review/withdraw/address',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '提现请求',
        caption: '审核提现请求',
        icon: 'format_list_numbered',
        target: '/review/withdraw',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '超时支付',
        caption: '管理超时支付账户',
        icon: 'format_list_numbered',
        target: '/review/payment',
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
    label: '激励体系 *',
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
      label: '佣金设置',
      caption: '管理邀请和购买佣金',
      icon: 'format_list_numbered',
      target: '/inspire/commission',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem]
  } as MenuItem, {
    menuId: uid(),
    label: '报表和账单 *',
    caption: '收入、支出统计',
    icon: 'format_list_numbered',
    target: '/billing',
    level: 0,
    sectionBegin: false,
    children: [{
      menuId: uid(),
      label: '商品收益',
      caption: '管理用户邀请码',
      icon: 'format_list_numbered',
      target: '/billing/incoming',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '销售收入',
      caption: '用户购买支付收入',
      icon: 'format_list_numbered',
      target: '/billing/payment',
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
    } as MenuItem]
  } as MenuItem
] as Array<MenuItem>

export {
  MainDrawerMenus
}
