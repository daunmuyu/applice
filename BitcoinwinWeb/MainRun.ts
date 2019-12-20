import { Main } from "./Main";
import { ApiHelper } from "./ServerApis/ApiHelper";
import { HttpClient } from "jack-one-script";

var configUrlContent = undefined;

function enterApp(configUrl) {

    if (window.api && !ApiHelper.IsDemoMode && window.api.pageParam.serverUrl.indexOf("192.168") < 0) {
        window.api.pageParam.serverUrl = configUrl.packageUrl;

    }


    ApiHelper.ServerAddress = configUrl.serverAddress;
    ApiHelper.ResourceAddress = configUrl.ResourceAddress;

    if (configUrl.apiUrls) {
        ApiHelper.UrlAddresses.currentUrls = configUrl.apiUrls;
        ApiHelper.UrlAddresses.apiUrls = configUrl.apiUrls;
    }

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

/**检查看看哪个域名能用 */
function checkDomains() {
    var configUrl;
    eval("configUrl=" + configUrlContent);
    var exit = false;
    if (Array.isArray(configUrl)) {
        var done = 0;

        (<any[]>configUrl).forEach(item => {
            window.api.ajax({
                url: `${item.packageUrl}/version.txt`,
                method: 'get',
            }, function (ret, err) {
                done++;
                if (exit)
                    return;

                if (ret) {
                    //这个域名配置可以使用
                    exit = true;
                    enterApp(item);
                }
                else if (err) {
                    if (!exit && done >= (<any[]>configUrl).length) {
                        window.setTimeout(checkDomains, 500);
                        return;
                    }
                }

            });
        });
    }
    else {
        enterApp(configUrl);
    }
}

function getServerAddress() {
    if (location.href.indexOf("?hideFrame") < 0) {
        var model;
        if (window.api) {
            model = window.api.require("kLine");
        }

        if (window.api && model.getConfig) {
            
            model.getConfig(function (ret, err) {
                if (ret) {
                    //alert(ret.content);
                    configUrlContent = ret.content;

                    window.api.writeFile({
                        path: 'fs://' + ApiHelper.webFolder + '/configUrlContent.txt',
                        data: configUrlContent
                    }, function (ret, err) {

                    });

                    checkDomains();

                }
                else {
                    if (!configUrlContent) {
                        window.setTimeout(getServerAddress, 1000);
                    }
                    else {
                        checkDomains();
                    }
                }
            });
        }
        else if (window.api)
        {
            window.api.ajax({
                url: `https://domainconfig.oss-cn-beijing.aliyuncs.com/domain/config.txt?t=${new Date().getTime()}`,
                method: 'get',
            }, function (ret, err) {

                if (ret) {

                    configUrlContent = JSON.stringify(ret)

                    window.api.writeFile({
                        path: 'fs://' + ApiHelper.webFolder + '/configUrlContent.txt',
                        data: configUrlContent
                    }, function (ret, err) {

                    });

                    checkDomains();

                }
                else {
                    if (!configUrlContent) {
                        window.setTimeout(getServerAddress, 1000);
                    }
                    else {
                        checkDomains();
                    }
                }

            });
        }
        else {
            configUrlContent = JSON.stringify({
                "packageUrl": "https://appstatic.bitcoinwin.io/app_bitwin/v3",
                "serverAddress": "https://bitcoin.bitcoinwin.io/baseinfo",
                "ResourceAddress": "https://appstatic.bitcoinwin.io/app_bitwin",
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
                    "payCenterUrl": "https://bitcoinwin.bitcoinwin.io/payment",
                    "appDownLoadUrl": "",
                    "indexUrl": "https://bitcoin.bitcoinwin.io/index"
                }
            });
            checkDomains();
        }
    }
    else {
        checkDomains();
    }
}

try {
    var needToGetServerAddress = true;

    if (window.api) {
        configUrlContent = window.api.readFile({
            path: 'fs://' + ApiHelper.webFolder + '/configUrlContent.txt',
            sync: true
        });

        //读取app boot刚刚检测完能用的域名
        var read_serverurl_config = window.api.getPrefs({
            sync: true,
            key: "read_serverurl_config"
        });
        if (read_serverurl_config) {
            eval("read_serverurl_config=" + read_serverurl_config);
            enterApp(read_serverurl_config);
            needToGetServerAddress = false;
        }
    }

    if (needToGetServerAddress) {
        getServerAddress();
    }    

}
catch (e) {
    alert("Main Error：" + e.message);
}
