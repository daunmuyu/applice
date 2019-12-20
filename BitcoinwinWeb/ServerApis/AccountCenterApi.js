import { HttpClient } from "jack-one-script";
import { ApiHelper } from "./ApiHelper";
var AccountCenterApi = /** @class */ (function () {
    function AccountCenterApi() {
    }
    AccountCenterApi.ForgetPassword = function (component, phone, pwd, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return AccountCenterApi.ForgetPassword(component, phone, pwd, callback); }, 1000);
            return;
        }
        var dict = {
            channelId: ApiHelper.ChannelId,
            phone: phone,
            password: pwd,
            passwordConfirm: pwd
        };
        var url = ApiHelper.UrlAddresses.currentUrls.accountCenterUrl + "/api/Account/ForgotPassword";
        HttpClient.postJson({
            data: dict,
            url: url,
            component: component,
            callback: function (ret, err) {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj;
                    eval("obj=" + ret);
                    if (obj.code != 200) {
                        callback(null, obj);
                    }
                    else {
                        callback(true, null);
                    }
                }
            },
        });
    };
    /**
     *
     * @param phone
     * @param globalZone
     * @param sendType 1:register , 2:forget password
     * @param callback
     */
    AccountCenterApi.SendSmsCode = function (component, phone, globalZone, sendType, callback) {
        if (globalZone === void 0) { globalZone = 0; }
        if (sendType === void 0) { sendType = 2; }
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return AccountCenterApi.SendSmsCode(component, phone, globalZone, sendType, callback); }, 1000);
            return;
        }
        var dict = {
            channelId: ApiHelper.ChannelId,
            phone: phone,
            globalZone: globalZone,
            sendType: sendType,
        };
        var url = ApiHelper.UrlAddresses.currentUrls.accountCenterUrl + "/api/Account/SendSmsCode";
        HttpClient.postJson({
            data: dict,
            url: url,
            component: component,
            callback: function (ret, err) {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj;
                    eval("obj=" + ret);
                    if (obj.code != 200) {
                        callback(null, obj);
                    }
                    else {
                        callback(true, null);
                    }
                }
            },
        });
    };
    AccountCenterApi.GetCountryInfoList = function (component, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return AccountCenterApi.GetCountryInfoList(component, callback); }, 1000);
            return;
        }
        var url = ApiHelper.UrlAddresses.currentUrls.accountCenterUrl + "/api/Account/GetCountryInfoList";
        HttpClient.send({
            url: url,
            method: "GET",
            component: component,
            callback: function (ret, err) {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj;
                    eval("obj=" + ret);
                    if (obj.code != 200) {
                        callback(null, obj);
                    }
                    else {
                        callback(obj.data, null);
                    }
                }
            },
        });
    };
    AccountCenterApi.Register = function (component, phone, password, timeZone, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return AccountCenterApi.Register(component, phone, password, timeZone, callback); }, 1000);
            return;
        }
        var url = ApiHelper.UrlAddresses.apiUrls.accountCenterUrl + "/api/Account/Register";
        HttpClient.postJson({
            url: url,
            data: {
                phone: phone,
                clientId: "upushapp",
                clientSecret: "secret",
                password: password,
                areaCode: timeZone,
                channelId: ApiHelper.ChannelId,
            },
            component: component,
            callback: function (ret, err) {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj;
                    eval("obj=" + ret);
                    if (obj.code != 200) {
                        callback(null, obj);
                    }
                    else {
                        callback(true, null);
                    }
                }
            },
        });
    };
    /**
     * Checks the phone sms code.
     * @param phone
     * @param smsCode
     * @param sendType 1:register , 2:forget password
     * @param callback
     */
    AccountCenterApi.CheckPhoneSmsCode = function (component, phone, smsCode, sendType, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return AccountCenterApi.CheckPhoneSmsCode(component, phone, smsCode, sendType, callback); }, 1000);
            return;
        }
        var dict = {
            channelId: ApiHelper.ChannelId,
            phone: phone,
            smsCode: smsCode,
            sendType: sendType
        };
        var url = ApiHelper.UrlAddresses.currentUrls.accountCenterUrl + "/api/Account/CheckPhoneSmsCode";
        HttpClient.postJson({
            data: dict,
            url: url,
            component: component,
            callback: function (ret, err) {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj;
                    eval("obj=" + ret);
                    if (obj.code != 200) {
                        callback(null, obj);
                    }
                    else {
                        callback(true, null);
                    }
                }
            },
        });
    };
    /**
     * 获取实名认证状态
     * @param component
     * @param callback
     */
    AccountCenterApi.GetCertificationStatus = function (component, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return AccountCenterApi.GetCertificationStatus(component, callback); }, 1000);
            return;
        }
        var url = ApiHelper.UrlAddresses.currentUrls.accountCenterUrl + "/api/Certification/GetCertificationStatus";
        HttpClient.postJson({
            method: "GET",
            url: url,
            component: component,
            header: {
                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
            },
            callback: function (ret, err) {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj;
                    eval("obj=" + ret);
                    if (obj.code != 200) {
                        callback(null, obj);
                    }
                    else {
                        callback(obj.data, null);
                    }
                }
            },
        });
    };
    /**
     * 实名认证
     * @param idCard
     * @param realName
     * @param certificationType 中国：1 其他：2
     * @param areaCode
     * @param callback
     */
    AccountCenterApi.Certification = function (component, idCard, realName, certificationType, areaCode, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return AccountCenterApi.Certification(component, idCard, realName, certificationType, areaCode, callback); }, 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }
        var dict = {
            channelId: ApiHelper.ChannelId,
            idCard: idCard,
            certificationType: certificationType,
            realName: realName,
            areaCode: areaCode
        };
        var url = ApiHelper.UrlAddresses.currentUrls.accountCenterUrl + "/api//Certification/Certification";
        HttpClient.postJson({
            data: dict,
            url: url,
            component: component,
            header: {
                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
            },
            callback: function (ret, err) {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj;
                    eval("obj=" + ret);
                    if (obj.code != 200) {
                        callback(null, obj);
                    }
                    else {
                        //进行第二步
                        AccountCenterApi.Certification2(component, idCard, realName, certificationType, areaCode, callback);
                    }
                }
            },
        });
    };
    AccountCenterApi.Certification2 = function (component, idCard, realName, certificationType, areaCode, callback) {
        var dict = {
            channelId: ApiHelper.ChannelId,
            realName: realName,
            certificationType: certificationType,
            areaCode: areaCode,
            idCard: idCard
        };
        var url = ApiHelper.UrlAddresses.currentUrls.accountUrl + "/api/Userinfo/SetRealNameAuth";
        HttpClient.postJson({
            data: dict,
            url: url,
            component: component,
            header: {
                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
            },
            callback: function (ret, err) {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj;
                    eval("obj=" + ret);
                    if (obj.code != 200) {
                        callback(null, obj);
                    }
                    else {
                        callback(true, null);
                    }
                }
            },
        });
    };
    return AccountCenterApi;
}());
export { AccountCenterApi };
//# sourceMappingURL=AccountCenterApi.js.map