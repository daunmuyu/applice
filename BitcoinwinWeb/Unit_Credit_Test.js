var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { AccountApi } from "./ServerApis/AccountApi";
import { HttpClient } from "jack-one-script";
import { ApiHelper } from "./ServerApis/ApiHelper";
var Unit_Credit_Test = /** @class */ (function () {
    function Unit_Credit_Test() {
    }
    Unit_Credit_Test.start = function () {
        HttpClient.defaultOption.async = false;
        Unit_Credit_Test.Login();
    };
    Unit_Credit_Test.Login = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AccountApi.Login(null, "13261952754", "s12345678", true)];
                    case 1:
                        _a.sent();
                        console.log("交易资产信息  ReturnCreditMoney");
                        AccountApi.GetTradeAssetsInfo(null, function (ret, err) {
                            if (err) {
                                console.error(JSON.stringify(err));
                            }
                            else {
                                console.log(JSON.stringify(ret));
                            }
                        });
                        Unit_Credit_Test.GetCreditInfo();
                        //币币入金
                        //UnitTest.PostCreditPayInMoney(1, 1, "BTC", "012345678", 1, "USDT");
                        console.log("信用法币入金 PostCreditPayInMoney");
                        Unit_Credit_Test.PostCreditPayInMoney(1000, 2, "CNY", undefined, 1, "USDT");
                        console.log("信用提现 PostCreditOutMoney");
                        Unit_Credit_Test.PostCreditOutMoney(1, "123456", 1, 1, "12212", 1, "BTC");
                        console.log("信用借款 BorrowCreditMoney");
                        AccountApi.BorrowCreditMoney(null, 10, function (ret, err) {
                            if (err) {
                                console.error(JSON.stringify(err));
                            }
                            else {
                                console.log(JSON.stringify(ret));
                            }
                        });
                        console.log("信用还款 ReturnCreditMoney");
                        AccountApi.ReturnCreditMoney(null, 1, "123456", 1, "USDT", 1, function (ret, err) {
                            if (err) {
                                console.error(JSON.stringify(err));
                            }
                            else {
                                console.log(JSON.stringify(ret));
                            }
                        });
                        console.log("还款列表 GetRepaymentList");
                        AccountApi.GetRepaymentList(null, 1, 10, function (ret, err) {
                            if (err) {
                                console.error(JSON.stringify(err));
                            }
                            else {
                                console.log(JSON.stringify(ret));
                            }
                        });
                        console.log("信用操作记录 GetUserCoinFlowList");
                        AccountApi.GetUserCoinFlowList(null, 1, "2019-01-01", "2020-01-01", 1, 10, function (ret, err) {
                            if (err) {
                                console.error(JSON.stringify(err));
                            }
                            else {
                                console.log(JSON.stringify(ret));
                            }
                        });
                        console.log("信用操作详情 GetUserCoinFlowDetail");
                        AccountApi.GetUserCoinFlowDetail(null, 1, function (ret, err) {
                            if (err) {
                                console.error(JSON.stringify(err));
                            }
                            else {
                                console.log(JSON.stringify(ret));
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    Unit_Credit_Test.GetCreditInfo = function () {
        AccountApi.GetCreditInfo(null, function (ret, err) {
            if (err) {
                console.error(JSON.stringify(err));
            }
            else {
                console.log(JSON.stringify(ret));
            }
        });
    };
    Unit_Credit_Test.PostCreditPayInMoney = function (payinmoney, payintype, sourcecurrency, txId, channel, currentcurrency) {
        return __awaiter(this, void 0, void 0, function () {
            var ret, request, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AccountApi.PostCreditPayInMoney(null, payinmoney, payintype, sourcecurrency, txId, channel, currentcurrency)];
                    case 1:
                        ret = _a.sent();
                        console.log(JSON.stringify(ret));
                        request = {
                            Amount: payinmoney,
                            PayAmount: 0,
                            AppId: ApiHelper.PayCenterAppId,
                            ChannelId: ApiHelper.ChannelId,
                            CorderId: ret,
                            Currency: "CNY",
                            Language: "zh-CN",
                            PayChannel: 1,
                            Price: 6,
                            ProductId: "USDT",
                            Ext: "",
                            Token: ApiHelper.CurrentTokenInfo.access_token,
                            Stamp: new Date().getTime()
                        };
                        url = AccountApi.BuildInMoneyUrl(request);
                        console.log("充值跳转页面：" + url);
                        return [2 /*return*/];
                }
            });
        });
    };
    Unit_Credit_Test.PostCreditOutMoney = function (collectMoneylId, password, payoutmoney, payouttype, coinaddress, channel, currentcurrency) {
        AccountApi.PostCreditOutMoney(null, collectMoneylId, password, payoutmoney, payouttype, coinaddress, channel, currentcurrency, function (ret, err) {
            if (err) {
                console.error(JSON.stringify(err));
            }
            else {
                console.log(JSON.stringify(ret));
            }
        });
    };
    return Unit_Credit_Test;
}());
export { Unit_Credit_Test };
//# sourceMappingURL=Unit_Credit_Test.js.map