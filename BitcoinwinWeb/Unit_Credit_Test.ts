import { AccountApi, BuyRequest } from "./ServerApis/AccountApi";
import { showError } from "./Global";
import { HttpClient } from "jack-one-script";
import { ApiHelper } from "./ServerApis/ApiHelper";

export class Unit_Credit_Test {
    static start() {
        HttpClient.defaultOption.async = false;

        Unit_Credit_Test.Login();
       
    }

    static async Login() {
        await AccountApi.Login(null, "13261952754", "s12345678", true);

        console.log("交易资产信息  ReturnCreditMoney");
        AccountApi.GetTradeAssetsInfo(null, (ret, err) => {
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
        AccountApi.BorrowCreditMoney(null, 10, (ret, err) => {
            if (err) {
                console.error(JSON.stringify(err));
            }
            else {
                console.log(JSON.stringify(ret));
            }
        });

        console.log("信用还款 ReturnCreditMoney");
        AccountApi.ReturnCreditMoney(null, 1, "123456", 1, "USDT", 1, (ret, err) => {
            if (err) {
                console.error(JSON.stringify(err));
            }
            else {
                console.log(JSON.stringify(ret));
            }
        });

        console.log("还款列表 GetRepaymentList");
        AccountApi.GetRepaymentList(null, 1, 10, (ret, err) => {
            if (err) {
                console.error(JSON.stringify(err));
            }
            else {
                console.log(JSON.stringify(ret));
            }
        });

        console.log("信用操作记录 GetUserCoinFlowList");
        AccountApi.GetUserCoinFlowList(null, 1, "2019-01-01", "2020-01-01", 1, 10, (ret, err) => {
            if (err) {
                console.error(JSON.stringify(err));
            }
            else {
                console.log(JSON.stringify(ret));
            }
        });

        console.log("信用操作详情 GetUserCoinFlowDetail");
        AccountApi.GetUserCoinFlowDetail(null, 1, (ret, err) => {
            if (err) {
                console.error(JSON.stringify(err));
            }
            else {
                console.log(JSON.stringify(ret));
            }
        });
    }

    static GetCreditInfo() {
       
        AccountApi.GetCreditInfo(null, (ret, err) => {
            if (err) {
                console.error(JSON.stringify(err));
            }
            else {
                console.log(JSON.stringify(ret));
            }
        });
    }

    static async PostCreditPayInMoney(payinmoney, payintype, sourcecurrency, txId, channel, currentcurrency) {
        var ret = await AccountApi.PostCreditPayInMoney(null, payinmoney, payintype, sourcecurrency, txId, channel, currentcurrency);
        console.log(JSON.stringify(ret));

        var request: BuyRequest = {
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
        var url = AccountApi.BuildInMoneyUrl(request);
        console.log("充值跳转页面：" + url);
    }

    static PostCreditOutMoney(collectMoneylId, password, payoutmoney, payouttype, coinaddress, channel, currentcurrency) {
        AccountApi.PostCreditOutMoney(null, collectMoneylId, password, payoutmoney, payouttype, coinaddress, channel, currentcurrency, (ret, err) => {
            if (err) {
                console.error(JSON.stringify(err));
            }
            else {
                console.log(JSON.stringify(ret));
            }
        });

    }
}