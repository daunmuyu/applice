var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { NavigationEvent } from "jack-one-script";
var MessageType = /** @class */ (function (_super) {
    __extends(MessageType, _super);
    function MessageType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MessageType.CommodityReady = 10;
    MessageType.StartRefreshQuotation = 11;
    MessageType.StopRefreshQuotation = 12;
    MessageType.Logined = 13;
    /**退出登录状态 */
    MessageType.Logout = 14;
    MessageType.LanguageChanged = 16;
    /**添加或者修改了收款账户信息 */
    MessageType.BankAccountsChanged = 17;
    /**接收到accountInfo */
    MessageType.ReceivedAccountInfo = 18;
    /**实名状态发生变化 */
    MessageType.CertificationStatusChanged = 19;
    MessageType.BeforePageHeaderBack = 20;
    /**获取到推送token*/
    MessageType.GetPushToken = 21;
    /**添加盯盘助手*/
    MessageType.InsertWatchPrice = 22;
    return MessageType;
}(NavigationEvent));
export { MessageType };
var MessageCenter = /** @class */ (function () {
    function MessageCenter() {
    }
    MessageCenter.raise = function (msgtype, param) {
        navigation.rasieEvent(msgtype, param);
    };
    MessageCenter.register = function (msgtype, action) {
        navigation.addEventListener(msgtype, action);
    };
    MessageCenter.unRegister = function (msgtype, action) {
        navigation.removeEventListener(msgtype, action);
    };
    return MessageCenter;
}());
export { MessageCenter };
//# sourceMappingURL=MessageCenter.js.map