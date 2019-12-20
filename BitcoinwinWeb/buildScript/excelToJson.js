var fs = require("fs");
var XLSX = require("xlsx");
var cnitems = {
    "首页": "首页",
    "行情": "行情",
    "交易": "交易",
    "我的": "我的",
    "未登录": "未登录",
    "高手排行榜": "高手排行榜",
    "活动专区": "活动专区",
    "我的推广": "我的推广",
    "新手教学": "新手教学",
    "热门品种推荐": "热门品种推荐",
    "用户": "用户",
    "排行": "排行",
    "收益率": "收益率", "盈利金额": "盈利金额", "品种": "品种", "最新价": "最新价", "涨跌幅": "涨跌幅", "行情列表-涨": "#f5221a", "行情列表-跌": "#0ea41a", "交易中": "交易中", "未开盘": "未开盘", "停止交易": "停止交易", "最高": "最高", "最低": "最低", "今开": "今开", "昨收": "昨收", "分时": "分时", "n分钟": "{0}分钟", "n小时": "{0}小时", "日K": "日K", "更多": "更多", "买入做多": "买入做多", "卖出做空": "卖出做空", "7x24小时": "7x24小时", "交易时间": "交易时间", "时间": "时间", "开": "开", "高": "高", "低": "低", "收": "收", "涨跌额": "涨跌额", "成交量": "成交量", "市价": "市价", "现价": "现价", "交易数量": "交易数量", "n手": "{0}手", "自定义": "自定义", "融资额": "融资额", "超级链接颜色": "#ef2b2b", "保证金": "保证金", "余额": "余额", "充值": "充值", "设置止盈/止损": "设置止盈/止损", "止盈价格": "止盈价格", "止损价格": "止损价格", "手续费率": "手续费率", "确定看涨做多": "确定看涨做多", "确定看跌做空": "确定看跌做空", "价格": "价格", "点击设置": "点击设置", "限价": "限价", "隔夜费说明": "每日UTC时间23:59:59后,平台将对所有持仓中的订单收取0.1%的隔夜费用,隔夜费计算规则：隔夜费=融资额×1‰", "理财风险揭示": "理财风险揭示", "市值": "市值", "成本价": "成本价", "用户消息": "用户消息", "活动消息": "活动消息", "系统消息": "系统消息", "消息提醒": "消息提醒", "联系客服": "联系客服", "已掌握清楚，去充值": "已掌握清楚，去充值!", "已掌握清楚，去提现": "已掌握清楚，去提现!", "已掌握清楚，去下单": "已掌握清楚，去下单!", "是": "是", "否": "否", "下单": "下单", "查看持仓": "查看持仓", "涨": "涨", "跌": "跌", "出入金相关": "出入金相关", "USDT相关": "USDT相关", "邀请好友相关": "邀请好友相关", "交易相关": "交易相关", "利息相关": "利息相关", "提现记录": "提现记录", "资金记录": "资金记录", "实名认证正在审核": "正在实名审核中...", "转入金额必须为x的整数倍": "提示：转入金额必须为{0}的整数倍", "请输入6位验证码": "请输入6位验证码", "没有读写存储卡相册的权限": "没有读写存储卡/相册的权限", "当前价": "当前价", "年化收益广告语": "年化15% ，保证金年化25%，赶紧充值赚取你的收益吧！", "至": "至", "无转入记录": "无转入记录", "挂单价": "挂单价", "年化累计收益说明": "年化累计收益为您入住平台后产生的年化收益总和，平台将于次月月初审核结算后汇入您的账户", "计息规则说明_title": "Bitcoinwin 计息规则说明", "计息规则说明": "\n                    昨日收益包含可用余额年化收益加上结算时持仓中保证金的年化收益：\n                    1、Bitcoinwin 采用复利模式，保证用户每日收益都有增加，计算公式如下：\n                    日收益=可用余额×0.000383（年化复利15%）+持仓保证金×0.000613（年化复利25%）\n                    例如：您有10000USDT可用金额和10000持仓中的保证金，\n\n                    日收益为： 10000×0.000383+10000×0.000613=3.83+6.13=9.96 USDT\n\n                    月累计收益为： 10000×(1.000383)^25 + 10000×(1.000613)^25-20000=300.1 USDT\n                    2、用户每月所获的收益将在每月月底最后一天结束全部存入账户（注意：提现当天不计息）；\n                    3、用户每月所获的收益将在每月月底最后一天结束全部存入账户；\n                    4、提现当天不计息。\n                    感谢您对Bitcoinwin 的支持与鼓励，欢迎您再次投资！如您在投资过程中遇到任何问题，请发邮件到service@bitcoinwin.io咨询。\n                ", "昨日收益": "昨日收益", "年化累计收益": "年化累计收益", "年化累计收益_短": "年化累计收益", "认证中...": "认证中...", "审核中...": "审核中...", "认证失败": "认证失败", "等待运营人员审核_审核结果将在一个工作日内返回": "等待运营人员审核，审核结果将在一个工作日内返回", "总资金已经不足全部开仓保证金": "尊敬的用户，您的总资金已经不足全部开仓保证金的{0}%， 请尽快处理, 谢谢。", "可用余额收益": "可用余额收益", "保证金收益": "保证金收益", "转入金额": "转入金额", "成功转入": "成功转入", "转入账户": "转入账户", "转入记录": "转入记录", "金额不足": "金额不足", "请输入转入金额": "请输入转入金额", "可转入金额": "可转入金额", "级别": "级别", "我的好友列表": "我的好友列表", "好友数量": "好友数量", "我邀请的好友": "我邀请的好友", "好友邀请的好友": "好友邀请的好友", "我的理财收入": "我的理财收入", "我的分享收入": "我的分享收入", "收益明细": "收益明细", "分享好友收获": "分享好友收获", "好友分享获赠": "好友分享获赠", "收益明细_可用余额收益": "可用余额收益", "收益明细_保证金收益": "保证金收益", "本月": "本月", "每日利息": "每日利息", "月总利息": "月总利息", "日期": "日期", "请选择收款账户": "请选择收款账户", "交易Dialog.委托确认": "委托确认", "交易Dialog.名称": "名称", "交易Dialog.委托价格": "委托价格", "交易Dialog.委托数量": "委托数量", "交易Dialog.交易数量": "交易数量", "交易Dialog.委托类型": "委托类型", "交易方式": "交易方式", "买入开仓": "买入开仓", "委托单号": "委托单号", "交易单号": "交易单号", "持仓单号": "持仓单号", "提交成功": "提交成功", "您的委托单已提交": "您的委托单已提交", "立刻体验": "立刻体验", "充值金额必须等值于": "充值金额不能小于{0}{1}的价值", "隔夜利息": "隔夜利息", "产品": "产品", "合约号": "合约号", "撤销的订单": "撤销的订单", "网络异常，请稍后再试": "网络异常，请稍后再试", "拷贝地址": "拷贝地址", "自动登录": "自动登录", "成功复制": "成功复制", "请输入止盈": "请输入止盈", "请输入止损": "请输入止损", "止损": "止损", "止盈": "止盈", "委托时间": "委托时间", "隔夜息": "隔夜息", "成功保存到相册": "成功保存到相册",
    "推广员升级规则": "分享好友赢福利",
    "推广员升级规则_内容": "1、我分享好友的福利\n                    用户通过分享二维码给好友，好友注册登录平台后，您就可每日获得好友账户总资金的{0}年化收益；\n\n                    2、好友分享好友的获赠福利\n                    您的好友分享二维码邀请伙伴入住平台后，您即可获取其好友账户总资金的{1}年化收益；\n\n                    分享即可有福利，还在等什么？马上分享赚福利吧！\n                ",
    "推广员升级规则_内容_VIP": `恭喜您成为币客盈VIP客户，目前您可以享受的福利如下：

您分享好友的福利
1、通过分享二维码给好友，好友注册登录平台后完成首笔入金您将得到10USDT的奖励；
2、可以获得好友账户总资金年化{0}收益，日计月结；
3、好友交易后您可以获得好友交易手续费的{2}返佣。

好友分享好友的获赠福利
您的好友分享他二维码邀请小伙伴入驻平台后，您的好友可以获得上述福利外，您还将获得：
1、其好友账户总资金年化{1}收益，日计月结；
2、其好友交易后您可以获得他交易手续费的{3}返佣。`,
    "点击保存二维码": "点击保存二维码", "发送给好友扫一扫立即赚收益": "发送给好友扫一扫，立即赚收益", "累计收入": "累计收入", "我的好友": "我的好友", "收获金额": "收获金额", "邀请好友": "邀请好友", "设置止盈止损": "设置止盈止损", "入金货币": "入金货币", "用户操作_detail": "用户操作", "系统操作_detail": "系统操作", "止盈平仓_detail": "止盈平仓", "止损平仓_detail": "止损平仓", "到达平仓时间_detail": "到达平仓时间", "规则组平仓_detail": "规则组平仓", "系统强平_detail": "系统强平", "确定要撤销这个委托单吗": "确定要撤销这个委托单吗?", "确定要撤销所有委托单吗": "确定要撤销所有委托单吗?", "确定平仓吗": "确定平仓吗?", "止盈价格必须大于": "止盈价格必须大于{0}", "止损价格必须小于": "止损价格必须小于{0}", "确定要关闭所有持仓吗": "确定要全部平仓吗？", "请输入价格": "请输入价格", "价格必须大于": "价格必须大于{0}", "撤销": "撤销", "浮动盈亏": "浮动盈亏", "完成": "完成", "交易记录": "交易记录", "无": "无", "价格_委托": "价格", "数量_委托": "数量", "实际成交_委托": "实际成交", "一键撤单": "一键撤单", "撤单": "撤单", "持仓": "持仓", "持仓中": "持仓", "账户": "账户", "品种名称": "品种名称", "交易列表按钮涨": "#f5221a,#f5221a", "交易列表按钮跌": "#0ea41a,#0ea41a", "TextColor涨": "#EA3131", "TextColor跌": "#0EA41A", "K线Tip涨": "#fd8366", "K线Tip跌": "#47f03f", "KLineUpColor": "#f34a4c", "KLineDownColor": "#1cbc79", "买入数量Format": "{0}手", "买入数量复数Format": "{0}手", "Text001": "{0}自动平仓，{4}{1}个点赚{2}美元 ({3} USDT)", "Text002": "当前汇率：{0}美元={1} USDT", "触发止损价格": "触发止损价格", "触发止盈价格": "触发止盈价格", "占用保证金": "占用保证金", "合计": "合计", "交易费用": "交易费用", "可用资金": "可用资金", "开仓价": "开仓价", "确定": "确定", "取消": "取消", "结算": "结算", "浮动总盈亏": "浮动总盈亏", "一键平仓": "一键平仓", "冻结保证金": "冻结保证金", "可用余额": "可用余额", "仓位": "仓位", "盈亏": "盈亏", "单号": "单号", "触发止盈": "触发止盈", "触发止损": "触发止损", "开仓": "开仓", "最新平仓": "最新平仓", "开仓时间": "开仓时间", "平仓时间": "平仓时间", "自动平仓": "{0}自动平仓", "止盈止损": "止盈止损", "快速平仓": "快速平仓", "开仓盈利": "开仓盈利", "做多": "做多", "做空": "做空", "再来一单": "再来一单", "盈亏n点": "盈亏{0}点", "点n盈利": "点({0})盈利", "止盈设置范围": "止盈设置范围1-240点，止损设置范围1-120点", "新手帮助": "新手帮助", "钱包": "钱包", "账户余额": "账户余额", "提现": "提现", "提现_法币": "法币 提现", "提现_USDT": "USDT 提现", "资金明细": "资金明细", "交易明细": "交易明细", "资金明细_充值": "充值", "资金明细_提现": "提现", "资金明细_开仓": "开仓", "资金明细_平仓": "平仓", "资金明细_费用": "费用", "资金明细_余额利息": "余额利息", "资金明细_保证金利息": "保证金利息", "个人中心": "个人中心", "银行卡绑定": "银行卡绑定", "手机号": "手机号", "未认证": "未认证", "常见问题": "常见问题", "模拟交易": "模拟交易", "我的徒弟": "我的徒弟", "挖矿": "挖矿", "我的收益": "我的收益", "关于我们": "关于我们", "设置": "设置", "用户注册": "用户注册", "手机号登录": "手机号登录", "登陆": "登录", "还没有账号去注册": " 还没有账号，去注册", "忘记密码": "忘记密码", "请输入密码": "请输入密码", "请输入手机号": "请输入手机号", "获取验证码": "获取验证码", "手机找回密码": "手机找回密码", "请输入验证码": "请输入验证码", "请输入手机验证码": "请输入手机验证码", "下一步": "下一步", "请输入新密码": "请输入新密码", "请再次输入新密码": "请再次输入新密码", "请输入m密码": "请输入8-16位数字和字母组合的密码", "请再次输入密码": "请再次输入新密码", "提交": "提交", "我阅读并同意": "我阅读并同意", "注册协议": "《注册协议》", "风险揭示_我的": "风险揭示", "风险揭示": "《风险揭示》", "实名认证": "实名认证", "国家": "国家", "请选择国家": "请选择国家", "姓名": "姓名", "证件号码": "证件号码", "提示输入身份证": "请输入身份证号，务必如实填写", "提示输入护照": "请输入护照号码，务必如实填写", "提示输入姓名": "请输入姓名，认证后不可更改", "币币入金": "币币入金", "币币入金提示": "支持USDT充值", "法币入金": "法币入金", "法币入金提示": "支持法币购买USDT进行充值", "充值数量": "充值数量", "充值数量提示": "请输入充值数量", "USDT充值数量提示": "最小充值数量{0}", "立刻充值": "立刻充值", "流水号": "流水号", "状态": "状态", "复制": "复制", "我已付款": "我已付款", "USDT重要提示": "重要提示：\n                    请勿向上述地址充值任何非{0}资产，否则资产将不可找回。您充值至上述地址后，需要整个网络节点的确认和人工审核操作，10-60分钟内可充值到您的交易账户中，请耐心等待。", "USDT完成提示": "注：完成充值操作后，请在下方输入区块链交易ID的后6位", "输入TXID号": "请输入TXID号的后6位", "持卡人姓名": "持卡人姓名", "持卡人姓名提示": "请输入持卡人姓名", "银行名称": "银行名称", "银行名称提示": "请选择银行", "开户地址": "开户地址", "省提示": "选择省份", "市提示": "选择城市", "选择省份": "选择省份", "选择城市": "选择城市", "绑定银行卡": "绑定银行卡", "银行卡号": "银行卡号", "银行卡号提示": "请输入银行卡号", "银行卡信息核对提示": "请仔细核对您的账户信息，确认无误后，提交信息。", "法币提现": "法币 提现", "USDT提现": "USDT 提现", "仅支持人民币提现操作": "仅支持人民币提现操作", "仅支持USDT提现操作": "仅支持USDT提现操作", "提币": "{0} 提币", "可用": "可用", "提币地址": "提币地址", "提币地址提示": "输入或通过复制按钮粘贴地址", "最小提币数量": "最小提币数量 {0}", "USDT提币长提示": "为保障资金账户安全，当您账户安全策略变更、密码修改、使用新地址提币，我们会对提币进行人工审核，请耐心等待。", "CNY提币长提示": "为保障资金账户安全，当您账户安全策略变更、密码修改、使用新地址提币，须核对提币地址无误，一旦转错将无法返回。由于个人输入地址、信息等操作失误带来的损失均由个人承担。", "到账数量": "到账数量", "立即提现": "立即提现", "提币数量": "提币数量", "全部": "全部", "手续费": "手续费", "设置支付密码": "设置支付密码", "请输入n位数的支付密码": "请输入{0}位数的支付密码", "支付密码确认不一致": "支付密码确认不一致", "取消设置安装未知来源App": "您已经取消安装未知来源应用程序，App升级取消！", "提示用户允许安装未知来源应用程序": "如果要进入自动升级程序，请允许安装未知来源应用程序！", "拒绝读写存储空间": "请在【设置】--【权限管理】开启软件读写手机内存及访问照片、媒体内容和文件权限，并设置允许APP获取手机号码、IMEI、IMSI权限，否则APP将无法自动升级与接收通知！", "UPush安装新版本提示": "App新版本已经准备就绪，是否立刻更新版本？", "立刻安装": "立刻安装", "下次安装": "下次安装", "用户名或者密码错误": "用户名或者密码错误", "n秒重新获取": "{0}秒重新获取", "请阅读并同意注册协议": "请阅读并同意注册协议", "密码确认不一致": "密码确认不一致", "注册成功": "注册成功", "成功设置密码": "成功设置密码", "交易成功": "交易成功", "提示数据还在加载": "数据正在加载中，请稍后...", "自动平仓时间n": "{0}自动平仓", "加载更多": "点击加载更多", "正在加载": "正在加载", "目前还没有数据": "目前还没有数据", "没有更多数据了": "没有更多数据了", "找不到此产品数据": "找不到此产品数据", "成功提交": "成功提交", "平仓": "平仓", "模拟行情": "模拟行情", "模拟持仓": "模拟持仓", "成功提交充值信息": "充值结果正在审批中，大约需要10-60分钟，请耐心等候！", "充值金额": "充值金额", "提现金额": "提现金额", "提示实名认证": "请先到个人中心进行实名认证", "语言选择": "语言选择", "版本": "版本", "退出登录": "退出登录", "确定退出登陆吗": "确定退出登录吗?", "检查更新": "检查更新", "已经是最新版本": "已经是最新版本", "成功设置支付密码": "成功设置支付密码", "发现新版本": "发现新版本", "发现新版稍后自动安装": "发现新版，稍后会自动安装", "收款账户": "收款账户", "请填写开户地址": "请填写开户地址", "成功提交申请等候审批": "成功提交申请，请等候审批", "请输入支付密码": "请输入支付密码", "请再次输入支付密码": "请再次输入支付密码", "平仓价": "平仓价", "确定n手交易": "确定{0}{1}{2}？", "账户总资产": "账户总资产", "持仓总额": "持仓总额", "继续下单": "继续下单", "认证成功": "认证成功", "重设支付密码": "重设支付密码", "玩法规则": "{0} 玩法规则", "什么是止损": "什么是止损?", "什么是止损_内容": "当单笔交易亏损金额触发（等于）指定的止损价格时，该笔交易会被止损平仓。例如：比特币买入做多或卖出做空时持仓盈亏为-20即触发止损自动平仓。", "什么是止盈": "什么是止盈?", "什么是止盈_内容": "当单笔交易盈利金额触发（等于）指定的止盈价格时，该笔交易会被止盈平仓。例如：比特币买入做多或卖出做空时持仓盈亏为17即触发止盈自动平仓。", "成功": "成功", "失败": "失败", "审核中": "审核中", "未支付": "未支付", "币种": "币种", "充值时间": "充值时间", "金额": "金额", "正在下载新版本": "正在下载新版本", "请先绑定银行卡": "请先绑定银行卡", "行情_未开盘": "未开盘", "行情_停止交易": "停止交易", "行情_交易中": "交易中", "打款中": "打款中", "持仓_保证金": "持仓总额", "持仓_持仓数量": "持仓", "登陆失效_请重新登陆": "登录失效，请重新登录", "目前不能进行模拟交易": "模拟交易已到期", "模拟交易操作时间还剩n天": "模拟交易操作时间还剩：{0}天", "网络异常": "网络异常", "持仓盈亏": "持仓盈亏", "可用保证金": "可用保证金", "平仓线": "平仓线", "持仓保证金": "持仓保证金", "委托": "委托", "持仓均价": "持仓均价", "融资金额": "融资金额",
    "行情_按钮": "行情",
    "最大只能n手": "最大只能{0}手",
    "点击重新加载": "点击重新加载",
    "成功截屏": "成功截屏",
    "邀请好友得返利": "邀请好友得返利",
    "低门槛 高杠杆 更高收益": "低门槛 高杠杆 更高收益",
    "分享福利说明": "分享福利说明",
    "法币充值": "法币充值",
    "币币充值": "币币充值",
    "支付渠道": "支付渠道",
    "马上充值": "马上充值",
    "充值注意事项": `注意事项
1、每笔订单有效时间为20分钟，请在20分钟内完成付款；
2、完成支付后，若订单状态为变为已完成，请联系客服进行处理；
3、当日取消OTC充值订单达5次后不可继续充值，请谨慎取消订单。`,
    "保存到相册": "保存到相册",
    "请输入充值金额": "请输入充值金额",
    "已认证": "已认证",
    "分享收益": "分享收益",
    "已实名": "已实名",
    "个人资料": "个人资料",
    "手机号码": "手机号码",
    "密码修改": "密码修改",
    "资产": "资产",
    "请上传护照正反面": "请上传护照正反面",
    "拍摄正面": "拍摄正面",
    "拍摄反面": "拍摄反面",
    "拍摄提示": "拍摄提示",
    "拍摄提示_内容": "1. 请拍摄时将证件平放，手机横向拍摄； \n2.确保护照边框完整、文字清晰可见；\n 3.照片上传后，若不满意可点击照片重新拍摄。",
    "分享给朋友": "分享给朋友",
    "交易资产": "交易资产",
    "明细": "明细",
    "立即还款": "立即还款",
    "自有资产": "自有资产",
    "借款": "借款",
    "信用资本": "信用资本",
    "数字币信用卡": "数字币信用卡",
    "余额宝": "余额宝",
    "转入余额": "转入余额",
    "累计收益": "累计收益",
    "待结算": "待结算",
    "昨日总收益": "昨日总收益",
    "余额收益": "余额收益",
    "账户利息收益": "账户利息收益",
    "年化": "{0}%年化",
    "邀请收益": "邀请收益",
    "邀请好友收益": "邀请好友收益",
    "n人": "{0}人",
    "存钱赚利息广告语": "存钱赚利息?\n平台提供全球最低15%+年化收益，高存储，高回报！",
    "首次入金奖励": "首次入金奖励",
    "信用资本理财资产": "信用资本理财资产",
    "充值信用资本": "充值信用资本",
    "提现信用资本": "提现信用资本",
    "历史记录": "历史记录",
    "可用信用金": "可用信用金",
    "还款": "还款",
    "提高信用值": "提高信用值",
    "没钱也能做交易": "没钱也能做交易",
    "马上提高信用值": "马上提高信用值",
    "点击设置价格": "点击设置价格",
    "手续费返佣": "手续费返佣",
    "确认转入": "确认转入",
    "筛选": "筛选",
    "币币提现": "币币提现",
    "法币入金出金流程快捷安全": "法币入金出金流程快捷安全",
    "推荐好友可获丰厚返利": "推荐好友可获<span style='font-size:0.75rem;font-weight:bold;color:#EA3131;'>丰厚</span>返利",
    "交易保证金年化收益n": "交易保证金年化收益<span style='font-size:0.9rem;font-weight:bold;color:#EA3131;'>{0}</span>",
    "低至10USDT一手": "低至10USDT一手",
    "账户余额年化收益n": "账户余额年化收益<span style='font-size:0.9rem;font-weight:bold;color:#EA3131;'>{0}</span>",
    "按天计息，按月支付，随时提现": "按天计息，按月支付，随时提现",
    "返利": "返利",
    "绑定收款账户": "绑定收款账户",
    "新手教学home": "新手教学",
    "银行卡账户": "银行卡账户",
    "EPay账户": "EPay账户",
    "账户类型": "账户类型",
    "邮箱地址": "邮箱地址",
    "添加": "添加",
    "您还没有信用资本": "您还没有信用资本",
    "马上充值信用资本": "马上充值信用资本",
    "您还没有信用额度": "您还没有信用额度",
    "马上获取信用额度": "马上获取信用额度",
    "信用额度": "信用额度",
    "{0}前需还款金额": "{0}前需还款金额",
    "逾期天数": "逾期天数",
    "n天": "{0}天",
    "逾期费用": "逾期费用",
    "借款数量": "借款数量",
    "余额还款": "余额还款",
    "数字币还款": "数字币还款",
    "请输入借款数量": "请输入借款数量",
    "请输入还款数量": "请输入还款数量",
    "免息截止日": "免息截止日",
    "提示": "提示",
    "还款提示": "1、您在7天内免费使用数字币信用金，7天后我们将根据您借用的金额适当收取利息； \n2、请务必确保您的账户资金充足，当您账户资金为0时，为确保平台资金正常运转，系统将自动扣除您的数字币资产；\n3、数字币信用金禁止提现使用；",
    "需支付": "需支付",
    "年化利息收入": "年化利息收入",
    "可用额度": "可用额度",
    "已用额度": "已用额度",
    "借款提示": `1、您在7天内免费使用数字币信用金，7天后我们将根据您借用的金额适当收取利息；
2、请务必确保您的账户资金充足，当您账户资金为0时，为确保平台资金正常运转，系统将自动扣除您的数字币资产；
3、数字币信用金禁止提现使用；`,
    "日逾期利息": "日逾期利息",
    "渠道充值": "渠道充值",
    "地址充值": "地址充值",
    "充值注意事项_credit": `注意事项：
1、充值币为信用额度的基础； 
2、充值币的价值随着市场汇率的变化而变化；
3、当账户余额小于币总值时，平台将自动扣除您产生信用的币种。`,
    "数据仍在加载中，请稍后再试": "数据仍在加载中，请稍后再试",
    "借款成功": "借款成功",
    "成功还款": "成功还款",
    "数字币总值": "数字币总值",
    "系统强制还款": "系统强制还款",
    "系统强制数字货币还款": "系统强制数字货币还款",
    "信用滞纳金": "信用滞纳金",
    "预计结算时间": "预计结算时间",
    "好友邀请收益": "好友邀请收益",
    "请输入n位支付密码": "请输入{0}位支付密码",
    "请输入n位验证码": "请输入{0}位验证码",
    "好友人数": "好友人数",
    "年化收益率": "年化收益率",
    "邀请收益余额": "邀请收益余额",
    "借用信用金额": "借用信用金额",
    "平仓委托成交": "平仓委托成交",
    "收益转入": "收益转入",
    "交易规则": "交易规则",
    "手续费返佣收益": "手续费返佣收益",
    "手续费总额": "手续费总额",
    "返佣比率": "返佣比率",
    "借款转入": "借款转入",
    "滞纳金": "滞纳金",
    "我要借款": "我要借款",
    "详情": "详情",
    "信用资本": "信用资本",
    "余额利息": "余额利息",
    "保证金利息": "保证金利息",
    "信用资本利息": "信用资本利息",
    "结算时间": "结算时间",
    "充值数字币": "充值数字币",
    "实际到账": "实际到账",
    "一键还款": "一键还款",
    "还款数量": "还款数量",
    "余额不足": "余额不足",
    "还款明细": "还款明细",
    "借款明细": "借款明细",
    "冻结资产": "冻结资产",
    "信用资本利息收益": "信用资本利息收益",
    "交易ID": "交易ID",
    "借款日期": "借款日期",
    "还款日期": "还款日期",
    "借款天数": "借款天数",
    "日逾期利率": "日逾期利率",
    "余额宝账户": "余额宝账户",
    "信用资本明细": "信用资本明细",
    "信用资本收益": "信用资本收益",
    "信用资本": "信用资本",
    "类型": "类型",
    "币币": "币币",
    "法币": "法币",
    "充值信用资本": "充值信用资本",
    "提取信用资本": "提取信用资本",
    "抵消信用资本": "抵消信用资本",
    "扣款数量": "扣款数量",
    "信用资本余额": "信用资本余额",
    "有新的版本,是否下载并安装": "有新的版本,是否下载并安装？",
    "正在下载应用": "正在下载应用",
};
var enItems = { "首页": "Home", "行情": "Quotation", "交易": "Trade", "我的": "Account", "未登录": "Not logged in", "高手排行榜": "Top Ranking", "活动专区": "Activity Area", "我的推广": "My Promotion", "新手教学": "Beginner's Guide", "热门品种推荐": "Recommendation of Popular Varieties", "用户": "User", "排行": "Ranking", "收益率": "Winning(%)", "盈利金额": "Profit", "最新价": "Price", "涨跌幅": "Change (%)", "行情列表-涨": "#0ea41a", "行情列表-跌": "#f5221a", "交易中": "Trading", "未开盘": "Closed", "停止交易": "Closed", "最高": "High", "最低": "Low", "今开": "Open", "昨收": "Close", "分时": "Line", "n分钟": "{0}min{1}", "n小时": "{0}hour{1}", "日K": "1day", "更多": "more", "买入做多": "Buy", "卖出做空": "Sell", "7x24小时": "7x24 Hours", "交易时间": "Trading Time", "时间": "Time", "开": "Open", "高": "High", "低": "Low", "收": "Close", "涨跌额": "Change", "成交量": "Volume", "市价": "Market Price", "现价": "New price", "交易数量": "Trade Volume", "n手": "{0}lot{1}", "自定义": "Custom", "融资额": "Leverage Amount", "超级链接颜色": "#ef2b2b", "保证金": "Margin", "余额": "Balance", "充值": "Deposit", "设置止盈/止损": "Set stop profit/loss", "止盈价格": "Stop Profit Target", "止损价格": "Stop Loss", "手续费率": "Fee(%)", "确定看涨做多": "Confirm Buy", "确定看跌做空": "Confirm Sell", "价格": "Price", "点击设置": "click to set", "限价": "Fixed price", "隔夜费说明": "Platform will charge the overnight rate to all opening positions after 23:59:59,Overnight Charging Rules:Overnight Charge = Lending Amount ×0.1%", "理财风险揭示": "Revealing Financial Risks", "市值": "Market price", "成本价": "Cost price", "用户消息": "User Message", "活动消息": "Activity Message", "系统消息": "System Message", "消息提醒": "Messages", "联系客服": "Contact Us", "已掌握清楚，去充值": "Have mastered clearly,go to deposit!", "已掌握清楚，去提现": "Have mastered clearly, Go cash out!", "已掌握清楚，去下单": "Have mastered clearly, go to the order!", "是": "Yes", "否": "No", "下单": "Order", "查看持仓": "Check Positions", "涨": "up", "跌": "down", "出入金相关": "Deposit/Withdrawal", "USDT相关": "USDT", "邀请好友相关": "Invite friends", "交易相关": "Trading", "利息相关": "Interest", "提现记录": "Details", "资金记录": "Details", "实名认证正在审核": "Real name identification verification is in process", "转入金额必须为x的整数倍": "Tip: Transfer amount must be an integral multiple of {0}", "请输入6位验证码": "Please enter a 6-bit verification code", "没有读写存储卡相册的权限": "No read-write access to memory cards", "当前价": "Current Price", "年化收益广告语": "Available balance annual gain 15%, margin annual gain 25%, deposit now, earn now", "至": "To", "无转入记录": "No transfer history", "挂单价": "Order Price", "年化累计收益说明": "Annual gain is accumulated, the gain will be deposited to your account at the beginning of each month.", "计息规则说明_title": "Bitcoinwin Interest rules", "计息规则说明": "\n                    The gain of yesterday include the available balance multiple the daily interest plus the margin multiple the daily interest.\n\n                    1. Bitcoinwin use compound interest rate,we add your daily gain to the avaiable balance to ensure your gain increasing everyday.\n                    Daily gain = The available balance×0.000383（Annual interest rate 15%）+The margin×0.000613（Annual interest rate 25%）\n                    Example: If your available balance is 10000 USDT and the margin is 1000 USDT\n                    Daily gain : 10000×0.000383+10000×0.000613=3.83+6.13=9.96 USDT\n                    Monthly gain : 10000×(1.000383)^25 + 10000×(1.000613)^25-20000=300.1 USDT\n\n                    2. Your monthly gain will be deposted to your account at the last day of the month(tips: No gain at the withdraw day)\n                    3.Your monthly gain will be deposted to your account at the last day of the month\n                    4.No gain at the withdraw day\n\n                    Very appreciate your support to Bitcoinwin, welcome to invest!\n                    If you have any question, please feel free to contact us at service@bitcoinwin.io\n                ", "昨日收益": "Earnings of yesterday", "年化累计收益": "Accumulated earnings", "年化累计收益_短": "Annual", "认证中...": "Certification auditing...", "审核中...": "Certification auditing...", "认证失败": "Certification fail", "等待运营人员审核_审核结果将在一个工作日内返回": "Waiting the apporval, the result will be available within one business day", "总资金已经不足全部开仓保证金": "Dear clients, your available balance is less than {0}% of the margin, please take care it asap. Thanks.", "可用余额收益": "Balance profit", "保证金收益": "Margin profit", "转入金额": "Transfer amount", "成功转入": "Trasfer sucessfully", "转入账户": "Transfer to account", "转入记录": "Transfer history", "金额不足": "not enough amount", "请输入转入金额": "Enter the amount to be transferred", "可转入金额": "Transferable amount", "级别": "Level", "我的好友列表": "My friends", "好友数量": "Number of friends", "我邀请的好友": "Friends I invited", "好友邀请的好友": "Friends Invited by Friends", "我的理财收入": "My financial income", "我的分享收入": "My Shared Income", "收益明细": "Income Details", "分享好友收获": "Share to friends", "好友分享获赠": "From friends", "收益明细_可用余额收益": "Profit from balance", "收益明细_保证金收益": "Profit from margin", "本月": "This month", "每日利息": "Day Interest", "月总利息": "Month Interest", "日期": "Date", "请选择收款账户": "Please select bank account", "交易Dialog.委托确认": "Order Confirm", "交易Dialog.名称": "Symbol", "交易Dialog.委托价格": "Order position", "交易Dialog.委托数量": "Order lots", "交易Dialog.交易数量": "Order lots", "交易Dialog.委托类型": "Order type", "交易方式": "Transaction mode", "买入开仓": "Buying open positions", "委托单号": "Order transaction", "交易单号": "Trading transaction", "持仓单号": "Transaction Number", "提交成功": "Submit Successfully", "您的委托单已提交": "Your order has been submitted successfully.", "立刻体验": "Try it", "充值金额必须等值于": "The recharge amount should not be less than {0} {1} in value", "隔夜利息": "Overnight interest", "产品": "Commodity", "合约号": "Contract Id", "撤销的订单": "Cancelled Orders", "网络异常，请稍后再试": "Network error, please try again later", "拷贝地址": "Copy Address", "自动登录": "Automatic sign in", "成功复制": "Copy Completed", "请输入止盈": "Please enter stop profit", "请输入止损": "Please enter stop loss", "止损": "Stop Loss", "止盈": "Stop Profit", "委托时间": "Order time", "隔夜息": "Overnight Rate", "成功保存到相册": "Saved to album successfully", "推广员升级规则": "Share to friends to win", "推广员升级规则_内容": "1.Share benefits to friends\n                    User share the QR code to friend, you will get {0} annually interest of your friend’s available balance\n\n                    2.Share benefits to friends\n                    You can get extra {1} annually interest of your friend’s invitations’ available balance.\n\n                    What are you waiting for? Share it now.\n                ", "推广员升级规则_内容_VIP": "Welcome becoming our VIP client. You can enjoy the following benefits from now on:\n\n\n      You can obtain the benefits from your friends\n\n      1. By sharing the QR code to your friends, you will be rewarded with 10USDT if they register and deposit.\n\n      2. You can get {0} annual income from the total funds of the Friends'Account, which is calculated daily and paid monthly.\n\n      3. You can get {2} commission rebate from the transaction fee.\n\n\n\n      Second Level Friend Sharing Benefits\n\n      After your friends share their QR code and invites your friends to join our platform, they can get all the above benefits, and you will get extra:\n\n      1. The annual {1} income of the total funds in the Friends'Account is calculated on a daily basis and paid monthly basis.\n\n      2. You can get {3} commission rebate from your friends transaction fee", "点击保存二维码": "Press to save", "发送给好友扫一扫立即赚收益": "Send to frends,earn money immediately", "累计收入": "Grand total amount", "我的好友": "My friends", "收获金额": "Amount received", "邀请好友": "Invite Friends", "设置止盈止损": "Set stop profit/stop loss", "入金货币": "Currency Type", "用户操作_detail": "User stop", "系统操作_detail": "Auto stop", "止盈平仓_detail": "Stop profit", "止损平仓_detail": "Stop loss", "到达平仓时间_detail": "Arrival time", "规则组平仓_detail": "Auto stop", "系统强平_detail": "Auto stop", "确定要撤销这个委托单吗": "Are you sure want to cancel the order?", "确定要撤销所有委托单吗": "Are you sure you want to cancel all orders?", "确定平仓吗": "Confirm to close out position?", "止盈价格必须大于": "Stop profit amount  must be greater than {0}", "止损价格必须小于": "Stop loss amount  must be less than {0}", "确定要关闭所有持仓吗": "Are you sure you want to close all positions?", "请输入价格": "Enter the price", "价格必须大于": "The price must be greater than {0}", "撤销": "Cancelled", "浮动盈亏": "Current P/L", "完成": "Completed", "交易记录": "Trading Details", "无": "not set", "价格_委托": "Price", "数量_委托": "Lot", "实际成交_委托": "Real deals", "一键撤单": "Cancel all orders", "撤单": "Cancel the order", "持仓": "Positions", "持仓中": "Holding position", "账户": "Account", "品种名称": "Instruments", "交易列表按钮涨": "#0ea41a,#0ea41a", "交易列表按钮跌": "#f5221a,#f5221a", "TextColor涨": "#0ea41a", "TextColor跌": "#EA3131", "K线Tip涨": "#47f03f", "K线Tip跌": "#fd8366", "KLineUpColor": "#1cbc79", "KLineDownColor": "#f34a4c", "买入数量Format": "{0} Lot", "买入数量复数Format": "{0} Lots", "Text001": "Automatic closing at {0}, {4} {1} point(s) to earn {2} USD ({3} USDT)", "Text002": "Exchange Rate: {0} USD={1} USDT", "触发止损价格": "Stop Loss", "触发止盈价格": "Take Profit", "占用保证金": "Margin", "合计": "Total", "交易费用": "Fee", "可用资金": "Available funds", "开仓价": "Open Price", "确定": "OK", "取消": "Cancel", "结算": "Statement", "浮动总盈亏": "Floating PnL", "一键平仓": "Close all positions", "冻结保证金": "Margin on hold", "可用余额": "Balance", "仓位": "Trade", "盈亏": "PnL", "单号": "Order No.", "触发止盈": "Take Profit", "触发止损": "Stop Loss", "开仓": "Open", "最新平仓": "Last Price", "开仓时间": "Open Time", "平仓时间": "Close Time", "自动平仓": "Automatic closing at {0}", "止盈止损": "Take profit and stop loss", "快速平仓": "Close position", "开仓盈利": "Start Trading", "做多": "Buy", "做空": "Sell", "再来一单": "Trade Again", "盈亏n点": "PnL {0} pip(s)", "点n盈利": "pip(s) ({0}) profit", "止盈设置范围": "Take profit between 1-240 pip(s)，Stop loss between 1-120 pip(s)", "新手帮助": "Beginners Guide", "钱包": "Wallet", "账户余额": "Balance", "提现": "Withdrawal", "提现_法币": "Fiat Money", "提现_USDT": "USDT", "资金明细": "Transaction Details", "交易明细": "Transaction Details", "资金明细_充值": "Deposits", "资金明细_提现": "Withdrawals", "资金明细_开仓": "Opened", "资金明细_平仓": "Closed", "资金明细_费用": "Fee", "资金明细_余额利息": "Interest on balance", "资金明细_保证金利息": "Interest on margin", "个人中心": "Account Center", "银行卡绑定": "Bind Bank Card", "手机号": "Mobile number", "未认证": "Not certified", "常见问题": "FAQ", "模拟交易": "Demo Trading", "我的徒弟": "My Followers", "挖矿": "Mining", "我的收益": "Mine Income", "关于我们": "About Us", "设置": "Settings", "用户注册": "Sign Up", "手机号登录": "Mobile Sign In", "登陆": "Sign In", "还没有账号去注册": "Sign up now", "忘记密码": "Forgot password", "请输入密码": "Please enter password", "请输入手机号": "Please enter mobile number", "获取验证码": "Get Code", "手机找回密码": "Recover password via mobile phone", "请输入验证码": "Verification code", "请输入手机验证码": "Verification code", "下一步": "Next", "请输入新密码": "Please enter a new password", "请再次输入新密码": "Password confirm", "请输入m密码": "Password(8-16 digits and letters)", "请再次输入密码": "Please enter your password again", "提交": "Submit", "我阅读并同意": "I have read and agree with", "注册协议": "\"User Agreement\"", "风险揭示_我的": "Risk Disclosure", "风险揭示": "\"Risk Disclosure\"", "实名认证": "Verified Full Name", "国家": "Country", "请选择国家": "Please choose a country", "姓名": "Full Name", "证件号码": "ID Number", "提示输入身份证": "Please enter your ID number and be sure to fill it correct", "提示输入护照": "Please enter your passport number and be sure to fill it correct", "提示输入姓名": "Please enter your full name", "币币入金": "Crypto Account", "币币入金提示": "USDT deposits", "法币入金": "Fiat Account", "法币入金提示": "Pay local currency to buy USDT", "充值数量": "Deposit Amount", "充值数量提示": "Please enter deposit amount", "USDT充值数量提示": "Minumum deposit is {0}", "立刻充值": "Deposit", "流水号": "OrderId", "状态": "Status", "复制": "Copy", "我已付款": "I have paid", "USDT重要提示": "Important：\n                    Do not deposit any non-{0} to the above address.Otherwise the assets will not be recovered. After you make a deposit to the above address need to wait for confirmation and manual review of the entire network node.\n                    Deposit will deposit to your trading account within 10-60 minutes, please wait.", "USDT完成提示": "Note: After completing deposit, please enter the last 6 digits of the order TXID number below.", "输入TXID号": "Enter last 6 figures of TXID number", "持卡人姓名": "Full Name", "持卡人姓名提示": "Please enter your full name", "银行名称": "Bank Name", "银行名称提示": "Please choose the bank", "开户地址": "Bank Address", "省提示": "Select province", "市提示": "Select city", "选择省份": "Select province", "选择城市": "Select city", "绑定银行卡": "Bind Bank Card", "银行卡号": "Bank Card Number", "银行卡号提示": "Please enter your bank card number", "银行卡信息核对提示": "Please check your account information carefully and submit if everything correct", "法币提现": "Fiat money withdrawal", "USDT提现": "Crypto money withdrawal", "仅支持人民币提现操作": "Only RMB withdrawal operation is supported", "仅支持USDT提现操作": "Only USDT withdrawal operation is supported", "提币": "Withdraw in {0}", "可用": "Available Balance", "提币地址": "USDT Wallet Address", "提币地址提示": "Enter or paste the address via the copy button", "最小提币数量": "Minumum withdrawal amount is {0}", "USDT提币长提示": "For the security purposes, your account security policy has been changed.Use new address for deposit crypto, we will manually check the coins, please be patient.", "CNY提币长提示": "In order to protect the security of the fund account, when your account security policy is changed, the password is modified, and the new address is used to withdraw the currency, you must verify that the coin address is correct. Once you turn the error, you will not be able to return.", "到账数量": "Received Amount", "立即提现": "Withdraw Now", "提币数量": "Withdrawal Amount", "全部": "All", "手续费": "Fee", "设置支付密码": "Setup Payment Password", "请输入n位数的支付密码": "Please enter a payment password of {0} digits", "支付密码确认不一致": "Payment password doesn't match", "取消设置安装未知来源App": "You have cancelled the installation of the unknown source application, the app upgrade is canceled! If you want to keep an automatic upgrade of app, please allow the installation of the unknown source application in your phone!", "提示用户允许安装未知来源应用程序": "If you want to enter the automatic upgrade program, please allow install an unknown source application.", "拒绝读写存储空间": "Please open the software to read and write the memory of mobile phone and access photos, media content and files, and set the permissions to allow APP to obtain the phone number, IMEI, IMSI, otherwise APP will not be able to automatically upgrade and receive notifications!", "UPush安装新版本提示": "The new version is available, update in now?", "立刻安装": "Install", "下次安装": "Next Time", "用户名或者密码错误": "Username or password is incorrect", "n秒重新获取": "{0}s", "请阅读并同意注册协议": "Please read and agree to the registration agreement.", "密码确认不一致": "Invalid password confirmation", "注册成功": "Register Successed", "成功设置密码": "Setup Password Successed", "交易成功": "Trade Successful", "提示数据还在加载": "Loading，Please wait...", "自动平仓时间n": "Automatic closing at {0}", "加载更多": "Click to load More", "正在加载": "Loading", "目前还没有数据": "No data to display", "没有更多数据了": "No more data to display", "找不到此产品数据": "The product data was not found.", "成功提交": "Submit Successed", "平仓": "Close", "模拟行情": "Price", "模拟持仓": "Trades", "成功提交充值信息": "Submit Successed! The recharge result is under examination and approval. It will take about 10-60 minutes. Please wait patiently.", "充值金额": "Deposit Amount", "提现金额": "Withdrawal Amount", "提示实名认证": "Please go to the account center for real name authentication first.", "语言选择": "Choose Language", "版本": "Version", "退出登录": "Sign Out", "确定退出登陆吗": "Are you sure you want to sign out?", "检查更新": "Check For Updates", "已经是最新版本": "Up to date", "成功设置支付密码": "Successfully set payment password", "发现新版本": "Discover New Version", "发现新版稍后自动安装": "Discover new version，automatic installation later.", "收款账户": "Account", "请填写开户地址": "Please fill in the account address.", "成功提交申请等候审批": "Submit your application successfully, please wait for approval.", "请输入支付密码": "Please enter the payment password", "请再次输入支付密码": "Please enter the payment password again", "平仓价": "Close Price", "确定n手交易": "Are you sure you want to {0} {1} of {2}?", "账户总资产": "Running Balance", "持仓总额": "Trade Amount", "继续下单": "Trade Again", "认证成功": "Authentication succeeds", "重设支付密码": "Reset the payment password", "玩法规则": "{0} Trading Rules", "什么是止损": "What is a stop loss?", "什么是止损_内容": "When a single transaction loss amount triggers (equal to) the specified stop loss amount, the trade will be closed by the stop loss automatically. For example, if the XRP \"Buy\" long or \"Sell\" short, the position's loss is -20 the trade will be closed automatically by Stop loss.", "什么是止盈": "What is take profit?", "什么是止盈_内容": "\"Take profit\" is an amount of money you intend to make in a trade. In your order, you specify an amount in USDT at which trade will close automatically. For example, if open \"Buy\" position in XRP with take profit at 17, it means that the trade will be closed automatically once profit will reach 17 USDT.", "成功": "successed", "失败": "failed", "审核中": "operating", "未支付": "waiting for pay", "币种": "Currency", "充值时间": "Deposit Time", "金额": "Amount", "正在下载新版本": "Downloading new app", "请先绑定银行卡": "Please bind bank card first", "行情_未开盘": "Close", "行情_停止交易": "Close", "行情_交易中": "Open", "打款中": "Paying", "持仓_保证金": "Margin", "持仓_持仓数量": "Holding lots", "目前不能进行模拟交易": "The demo trading is expired", "模拟交易操作时间还剩n天": "There are {0} days left for Demo Trading", "网络异常": "network error", "持仓盈亏": "Total P/L", "可用保证金": "Available Margin", "平仓线": "Closing out position", "持仓保证金": "Position Margin", "委托": "Pending Order", "持仓均价": "Average position", "融资金额": "Leverage Amount", "行情_按钮": "Price", "最大只能n手": "Max. {0} hands", "点击重新加载": "Click to reload", "成功截屏": "Screen shot successfully", "n人": "{0} people{1}", "新手教学home": "Beginner", "EPay账户": "EPay Account", "登陆失效_请重新登陆": "请重新登陆", "邀请好友得返利": "邀请好友得返利", "低门槛 高杠杆 更高收益": "低门槛 高杠杆 更高收益", "分享福利说明": "分享福利说明", "法币充值": "Fiat money deposit", "币币充值": "Crypto money deposit", "支付渠道": "Pay Channel", "马上充值": "Deposit now", "充值注意事项": "注意事项\n1、每笔订单有效时间为20分钟，请在20分钟内完成付款；\n2、完成支付后，若订单状态为变为已完成，请联系客服进行处理；\n3、当日取消OTC充值订单达5次后不可继续充值，请谨慎取消订单。", "保存到相册": "Save to album", "请输入充值金额": "请输入充值金额", "已认证": "已认证", "分享收益": "分享收益", "已实名": "已实名", "个人资料": "个人资料", "手机号码": "手机号码", "密码修改": "密码修改", "资产": "资产", "请上传护照正反面": "请上传护照正反面", "拍摄正面": "拍摄正面", "拍摄反面": "拍摄反面", "拍摄提示": "拍摄提示", "拍摄提示_内容": "1. 请拍摄时将证件平放，手机横向拍摄； \n2.确保护照边框完整、文字清晰可见；\n 3.照片上传后，若不满意可点击照片重新拍摄。", "分享给朋友": "分享给朋友", "交易资产": "交易资产", "明细": "明细", "立即还款": "立即还款", "自有资产": "自有资产", "借款": "借款", "信用资本": "信用资本", "数字币信用卡": "数字币信用卡", "余额宝": "余额宝", "转入余额": "转入余额", "累计收益": "累计收益", "待结算": "待结算", "昨日总收益": "昨日总收益", "余额收益": "余额收益", "账户利息收益": "账户利息收益", "年化": "{0}%年化", "邀请收益": "邀请收益", "邀请好友收益": "邀请好友收益", "存钱赚利息广告语": "存钱赚利息?\n平台提供全球最低15%+年化收益，高存储，高回报！", "首次入金奖励": "首次入金奖励", "信用资本理财资产": "信用资本理财资产", "充值信用资本": "充值信用资本", "提现信用资本": "提现信用资本", "历史记录": "历史记录", "可用信用金": "可用信用金", "还款": "还款", "提高信用值": "提高信用值", "没钱也能做交易": "没钱也能做交易", "马上提高信用值": "马上提高信用值", "点击设置价格": "点击设置价格", "手续费返佣": "手续费返佣", "确认转入": "确认转入", "筛选": "筛选", "币币提现": "币币提现", "法币入金出金流程快捷安全": "法币入金出金流程快捷安全", "推荐好友可获丰厚返利": "推荐好友可获<span style='font-size:0.75rem;font-weight:bold;color:#EA3131;'>丰厚</span>返利", "交易保证金年化收益n": "交易保证金年化收益<span style='font-size:0.9rem;font-weight:bold;color:#EA3131;'>{0}</span>", "低至10USDT一手": "低至10USDT一手", "账户余额年化收益n": "账户余额年化收益<span style='font-size:0.9rem;font-weight:bold;color:#EA3131;'>{0}</span>", "按天计息，按月支付，随时提现": "按天计息，按月支付，随时提现", "返利": "返利", "绑定收款账户": "绑定收款账户" };
var workbook = XLSX.readFile(__dirname + "\\data.xls");
// 获取 Excel 中所有表名
var sheetNames = workbook.SheetNames; // 返回 ['sheet1', 'sheet2']
// 根据表名获取对应某张表
var worksheet = workbook.Sheets[sheetNames[0]];

function getCNKey(content) {
    for (var p in cnitems) {
        if (cnitems[p] == content)
            return p;
    }
    return null;
}

var json = XLSX.utils.sheet_to_json(worksheet);
for (var i = 0; i < json.length; i++) {
    var item = json[i];
    var key = getCNKey(item.中文);
    if (!key)
        console.log("丢失：" + item.中文);
    else {
        enItems[key] = item.英文;
    }
}


fs.writeFileSync(__dirname + "/xlsx.txt", JSON.stringify(enItems), "utf-8");//将打包的内容写入 当前目录下的 result.zip中