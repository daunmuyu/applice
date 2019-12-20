import { ApiHelper } from "./ServerApis/ApiHelper";
import { Main } from "./Main";


ApiHelper.ChannelId = 2;
ApiHelper.ServerAddress = "https://devapp.chainpayworld.com/baseinfo";

ApiHelper.SupportedPayChannels = [

    {
        name: "Citpay",
        id: 5,
        channel: 5,
        limit: "200-7000",
        supportedCurrencies: ["USDT"],
        supportAlipay: false,
        supportWx: false,
        supportBank: true,
        pushUSDT: true,
    },
    {
        name: "OTC",
        id: 1,
        channel: 1,
        limit: "200-7000",
        supportedCurrencies: ["USDT"],
        supportAlipay: false,
        supportWx: false,
        supportBank: true,
        pushUSDT: true,
    },
    //{
    //    name: "WangCai",
    //    id: 4,
    //    channel: 3,
    //    limit: "100-2000",
    //    supportedCurrencies: ["USDT", "BTC"],
    //    supportAlipay: false,
    //    supportWx: false,
    //    supportBank: true,
    //    pushUSDT: false,
    //}
];

//ApiHelper.ServerAddress = "https://bitcoinwin.chainpayworld.com/baseinfo";
//ApiHelper.UrlAddresses.currentUrls = ApiHelper.UrlAddresses.apiUrls;
//ApiHelper.UrlAddressReady = true;
ApiHelper.OTCSecret = "test";

Main.start();