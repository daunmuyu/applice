import { NavigationEvent } from "jack-one-script";

export class MessageType extends NavigationEvent {
    static CommodityReady = 10;
    static StartRefreshQuotation = 11;
    static StopRefreshQuotation = 12;
    static Logined = 13;
    /**退出登录状态 */
    static Logout = 14;

    static LanguageChanged = 16;
    /**添加或者修改了收款账户信息 */
    static BankAccountsChanged = 17;
    /**接收到accountInfo */
    static ReceivedAccountInfo = 18;
    /**实名状态发生变化 */
    static CertificationStatusChanged = 19;
    static BeforePageHeaderBack = 20;

    /**获取到推送token*/
    static GetPushToken = 21;

    /**添加盯盘助手*/
    static InsertWatchPrice = 22;
}

export class MessageCenter {
    static raise(msgtype: MessageType, param) {
        navigation.rasieEvent(msgtype, param);
    }
    static register(msgtype: MessageType, action: (param) => void) {
        navigation.addEventListener(msgtype, action);
    }
    static unRegister(msgtype: MessageType, action: (param) => void) {
        navigation.removeEventListener(msgtype, action);
    }
}