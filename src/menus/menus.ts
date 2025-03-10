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
    label: '第三方登录',
    caption: '管理第三方登录',
    icon: 'pending',
    target: '/thirdparty',
    level: 0,
    sectionBegin: false,
    children: [
      {
        menuId: uid(),
        label: '第三方登录',
        caption: '管理第三方登录',
        icon: 'pending',
        target: '/oauththirdparty',
        level: 0,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '授权第三方登录',
        caption: '给APP授权第三方登录',
        icon: 'pending',
        target: '/appoauththirdparty',
        level: 0,
        sectionBegin: false,
        children: []
      }
    ]
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
        label: '币种汇率管理',
        caption: '管理币种汇率',
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
      } as MenuItem, {
        menuId: uid(),
        label: '汇率历史',
        caption: '查看汇率历史',
        icon: 'pending',
        target: '/coin/history',
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
      } as MenuItem, {
        menuId: uid(),
        label: '合约管理地址',
        caption: '管理和部署合约的地址',
        icon: 'perm_identity',
        target: '/account/contract',
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
      caption: '查看所有商品',
      icon: 'perm_identity',
      target: '/goods',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '商品币种管理',
      caption: '添加与编辑商品币种',
      icon: 'perm_identity',
      target: '/good/goodcoins',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '商品故障管理',
      caption: '添加与编辑商品故障记录',
      icon: 'perm_identity',
      target: '/good/malfunctions',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '算力租赁',
      caption: '添加与编辑算力租赁商品',
      icon: 'perm_identity',
      target: '/good/powerrentals',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '委托质押',
      caption: '添加与编辑委托质押商品',
      icon: 'perm_identity',
      target: '/good/delegatedstakings',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '电费/服务费',
      caption: '添加与编辑电费/服务费商品',
      icon: 'perm_identity',
      target: '/good/fees',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: 'APP商品管理',
      caption: '查看商品',
      icon: 'perm_identity',
      target: '/good/appgoods',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: 'APP算力租赁管理',
      caption: '授权、价格与上下架管理',
      icon: 'perm_identity',
      target: '/good/apppowerrentals',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: 'APP委托质押管理',
      caption: '授权上下架管理',
      icon: 'perm_identity',
      target: '/good/appdelegatedstakings',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: 'APP电费/服务费管理',
      caption: '授权、价格与上下架管理',
      icon: 'perm_identity',
      target: '/good/appfees',
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
      label: '置顶类别',
      caption: '管理商品置顶类别',
      icon: 'perm_identity',
      target: '/app/good/topmosts',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '置顶购买约束',
      caption: '管理置顶购买约束',
      icon: 'perm_identity',
      target: '/app/good/topmost/constraints',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '置顶类别海报',
      caption: '管理置顶类别海报',
      icon: 'perm_identity',
      target: '/app/good/topmost/posters',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '置顶商品',
      caption: '管理置顶商品',
      icon: 'perm_identity',
      target: '/app/good/topmost/goods',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '置顶商品购买约束',
      caption: '管理置顶商品购买约束',
      icon: 'perm_identity',
      target: '/app/good/topmost/good/constraints',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '置顶商品海报',
      caption: '管理置顶商品海报',
      icon: 'perm_identity',
      target: '/app/good/topmost/good/posters',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '评论',
      caption: '管理商品评论',
      icon: 'perm_identity',
      target: '/app/good/comments',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '默认商品',
      caption: '设置币种默认商品',
      icon: 'perm_identity',
      target: '/app/good/defaults',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '商品描述',
      caption: '创建和编辑商品描述',
      icon: 'perm_identity',
      target: '/app/good/descriptions',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '商品展示颜色',
      caption: '创建和编辑商品展示颜色',
      icon: 'perm_identity',
      target: '/app/good/displaycolors',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '商品展示名称',
      caption: '创建和编辑商品展示名称',
      icon: 'perm_identity',
      target: '/app/good/displaynames',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '商品标签',
      caption: '管理商品标签',
      icon: 'perm_identity',
      target: '/app/good/labels',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '商品海报',
      caption: '管理商品海报',
      icon: 'perm_identity',
      target: '/app/good/posters',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '商品依赖',
      caption: '管理商品依赖关系',
      icon: 'perm_identity',
      target: '/good/requireds',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: 'APP商品依赖',
      caption: '管理APP商品依赖关系',
      icon: 'perm_identity',
      target: '/app/good/requireds',
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
        target: '/supply/devicetypes',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '设备供应商',
        caption: '管理设备供应商',
        icon: 'perm_identity',
        target: '/supply/device/manufacturers',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '设备海报',
        caption: '管理设备海报',
        icon: 'perm_identity',
        target: '/supply/device/posters',
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
      } as MenuItem, {
        menuId: uid(),
        label: '品牌',
        caption: '管理品牌',
        icon: 'perm_identity',
        target: '/supply/vendorbrands',
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
      } as MenuItem, {
        menuId: uid(),
        label: '券提现请求',
        caption: '审核券提现请求',
        icon: 'format_list_numbered',
        target: '/review/couponwithdraw',
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
    } as MenuItem, /* {
      menuId: uid(),
      label: '活动',
      caption: '管理APP活动',
      icon: 'format_list_numbered',
      target: '/inspire/activity',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, */{
      menuId: uid(),
      label: '券',
      caption: '管理代金券',
      icon: 'format_list_numbered',
      target: '/inspire/coupon',
      // query: { couponType: coupon.CouponType.FixAmount },
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, /* {
      menuId: uid(),
      label: '折扣券',
      caption: '管理折扣代金券',
      icon: 'format_list_numbered',
      target: '/inspire/coupon',
      query: { couponType: coupon.CouponType.Discount },
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '用户定向券',
      caption: '管理定向用户代金券',
      icon: 'format_list_numbered',
      target: '/inspire/coupon',
      query: { couponType: coupon.CouponType.SpecialOffer },
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, */ {
      menuId: uid(),
      label: '邀请关系',
      caption: '查看用户邀请关系',
      icon: 'format_list_numbered',
      target: '/inspire/registration',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '激励配置',
      caption: '查看系统激励配置',
      icon: 'format_list_numbered',
      target: '/inspire/appconfig',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '系统佣金配置',
      caption: '查看系统佣金配置',
      icon: 'format_list_numbered',
      target: '/inspire/commissionconfig',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '事件配置',
      caption: '查看事件配置',
      icon: 'format_list_numbered',
      target: '/inspire/event',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '激励币种配置',
      caption: '查看激励币种配置',
      icon: 'format_list_numbered',
      target: '/inspire/coinconfig',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '激励任务配置',
      caption: '查看激励任务配置',
      icon: 'format_list_numbered',
      target: '/inspire/taskconfig',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '用户激励记录',
      caption: '查看用户激励记录',
      icon: 'format_list_numbered',
      target: '/inspire/userreward',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '用户任务记录',
      caption: '查看用户任务记录',
      icon: 'format_list_numbered',
      target: '/inspire/usertask',
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
        label: 'APP订阅授权',
        caption: '管理APP订阅授权',
        icon: 'format_list_numbered',
        target: '/app/subscribe',
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
        label: '离线电费/服务费订单',
        caption: '创建离线电费/服务费订单',
        icon: 'format_list_numbered',
        target: '/order/offline/fee',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '离线算力订单',
        caption: '创建离线算力订单',
        icon: 'format_list_numbered',
        target: '/order/offline/powerrental',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '模拟订单配置',
        caption: '模拟订单配置',
        icon: 'format_list_numbered',
        target: '/order/appconfig',
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
  } as MenuItem, {
    menuId: uid(),
    label: '交易',
    caption: '交易管理',
    icon: 'reviews',
    target: '/txs',
    level: 0,
    sectionBegin: false,
    children: [
      {
        menuId: uid(),
        label: '交易列表',
        caption: '',
        icon: 'format_list_numbered',
        target: '/txs',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem
    ]
  } as MenuItem, {
    menuId: uid(),
    label: '矿池',
    caption: '授权矿池、管理矿池子账户等',
    icon: 'pending',
    target: '/miningpool',
    level: 0,
    sectionBegin: false,
    children: [
      {
        menuId: uid(),
        label: '矿池信息',
        caption: '管理矿池信息',
        icon: 'perm_identity',
        target: '/miningpool/pool',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem,
      {
        menuId: uid(),
        label: '矿池币种信息',
        caption: '管理币种信息',
        icon: 'perm_identity',
        target: '/miningpool/coin',
        level: 1,
        sectionBegin: false,
        children: []
      }as MenuItem,
      {
        menuId: uid(),
        label: '矿池提币规则',
        caption: '管理提币规则',
        icon: 'perm_identity',
        target: '/miningpool/fractionrule',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem,
      {
        menuId: uid(),
        label: '矿池RootUser管理',
        caption: '管理RootUser',
        icon: 'perm_identity',
        target: '/miningpool/rootuser',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem,
      {
        menuId: uid(),
        label: '矿池GoodUser管理',
        caption: '管理GoodUser',
        icon: 'perm_identity',
        target: '/miningpool/gooduser',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem,
      {
        menuId: uid(),
        label: 'APP矿池管理',
        caption: '授权矿池到APP',
        icon: 'perm_identity',
        target: '/miningpool/app/pool',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem
    ]
  }as MenuItem
] as Array<MenuItem>

export {
  MainDrawerMenus
}
