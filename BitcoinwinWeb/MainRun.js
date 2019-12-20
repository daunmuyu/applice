import { Main } from "./Main";
import { ApiHelper } from "./ServerApis/ApiHelper";
var configUrl = "https://domainconfig.oss-cn-beijing.aliyuncs.com/domain/config.txt";
var configUrlContent = undefined;
function enterApp() {
    var configUrl;
    eval("configUrl=" + configUrlContent);
    if (window.api && !ApiHelper.IsDemoMode && window.api.pageParam.serverUrl.indexOf("192.168") < 0) {
        window.api.pageParam.serverUrl = configUrl.packageUrl;
        window.api.writeFile({
            path: 'fs://' + ApiHelper.webFolder + '/serverUrl.txt',
            data: window.api.pageParam.serverUrl
        }, function (ret, err) {
        });
    }
    ApiHelper.ServerAddress = configUrl.serverAddress;
    ApiHelper.ResourceAddress = configUrl.ResourceAddress;
    if (configUrl.apiUrls)
        ApiHelper.UrlAddresses.currentUrls = configUrl.apiUrls;
    for (var p in ApiHelper.UrlAddresses.currentUrls) {
        ApiHelper.UrlAddresses.demoApiUrls[p] = ApiHelper.UrlAddresses.currentUrls[p];
    }
    ApiHelper.UrlAddresses.demoApiUrls.tradeUrl = ApiHelper.UrlAddresses.demoApiUrls.tradeUrl.replace("/trade", "/demotrade");
    //demoApiUrls
    if (ApiHelper.IsDemoMode) {
        ApiHelper.UrlAddresses.currentUrls = ApiHelper.UrlAddresses.demoApiUrls;
    }
    if (configUrl.apiUrls)
        ApiHelper.UrlAddressReady = true;
    console.log("ResourceAddress" + ApiHelper.ResourceAddress);
    Main.start();
}
function getServerAddress() {
    if (location.href.indexOf("?hideFrame") < 0) {
        if (window.api) {
            window.api.writeFile({
                path: 'fs://' + ApiHelper.webFolder + '/config_Url.txt',
                data: configUrl
            }, function (ret, err) {
            });
            window.api.ajax({
                url: configUrl + "?t=" + new Date().getTime(),
                method: 'get',
            }, function (ret, err) {
                if (ret) {
                    configUrlContent = JSON.stringify(ret);
                    window.api.writeFile({
                        path: 'fs://' + ApiHelper.webFolder + '/configUrlContent.txt',
                        data: configUrlContent
                    }, function (ret, err) {
                    });
                    enterApp();
                }
                else {
                    if (!configUrlContent) {
                        window.setTimeout(getServerAddress, 1000);
                    }
                    else {
                        enterApp();
                    }
                }
            });
        }
        else {
            configUrlContent = JSON.stringify({
                "packageUrl": "https://bitcoin.bitcoinwin.io/app_bitwin/v3",
                "serverAddress": "https://bitcoin.bitcoinwin.io/baseinfo",
                "ResourceAddress": "https://appstatic.chainpayworld.com/app_bitwin",
                "apiUrls": {
                    "accountUrl": "https://bitcoin.bitcoinwin.io/account",
                    "marketUrl": "https://bitcoin.bitcoinwin.io/market",
                    "tradeUrl": "https://bitcoin.bitcoinwin.io/trade",
                    "mexUrl": "",
                    "marketWS": "wss://bitcoin.bitcoinwin.io/marketws/tickdata",
                    "h5Url": "",
                    "ctcUrl": "",
                    "playUrl": "",
                    "accountCenterUrl": "https://bitcoin.bitcoinwin.io/accountcenter",
                    "payCenterUrl": "https://bitcoin.bitcoinwin.io/payment",
                    "appDownLoadUrl": "",
                    "indexUrl": "https://bitcoin.bitcoinwin.io/index"
                }
            });
            enterApp();
        }
    }
    else {
        enterApp();
    }
}
try {
    if (window.api) {
        configUrlContent = window.api.readFile({
            path: 'fs://' + ApiHelper.webFolder + '/configUrlContent.txt',
            sync: true
        });
    }
    getServerAddress();
}
catch (e) {
    alert("Main Error：" + e.message);
}
//# sourceMappingURL=MainRun.js.map