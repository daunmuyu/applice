import { HttpClient } from "jack-one-script";
import { ApiHelper, ServerResult, CertificationStatus } from "./ApiHelper";
import { IHttpClientUsing } from "jack-one-script";
import { Component } from "jack-one-script";

export class AccountCenterApi {
    static ForgetPassword(component: IHttpClientUsing, phone,pwd, callback: (ret, err) => void) {

        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => AccountCenterApi.ForgetPassword(component, phone, pwd, callback), 1000);
            return;
        }

        var dict = {
            channelId: ApiHelper.ChannelId,
            phone: phone,
            password: pwd,
            passwordConfirm: pwd
        };

        var url = `${ApiHelper.UrlAddresses.currentUrls.accountCenterUrl}/api/Account/ForgotPassword`;

        HttpClient.postJson({
            data: dict,
            url: url,
            component: component,
            callback: (ret, err) => {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj: ServerResult;
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
    }

    /**
     * 
     * @param phone
     * @param globalZone
     * @param sendType 1:register , 2:forget password
     * @param callback
     */
    static SendSmsCode(component: IHttpClientUsing,phone: string, globalZone: number = 0, sendType: number = 2, callback: (ret, err) => void) {

        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => AccountCenterApi.SendSmsCode(component, phone, globalZone, sendType, callback), 1000);
            return;
        }

        var dict = {
            channelId: ApiHelper.ChannelId,
            phone: phone,
            globalZone: globalZone,
            sendType: sendType,
        };

        var url = `${ApiHelper.UrlAddresses.currentUrls.accountCenterUrl}/api/Account/SendSmsCode`;

        HttpClient.postJson({
            data: dict,
            url: url,
            component: component,
            callback: (ret, err) => {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj: ServerResult;
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
    }

    static GetCountryInfoList(component: IHttpClientUsing, callback: (ret: Country[], err) => void) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => AccountCenterApi.GetCountryInfoList(component,callback), 1000);
            return;
        }

        var url = `${ApiHelper.UrlAddresses.currentUrls.accountCenterUrl}/api/Account/GetCountryInfoList`;

        HttpClient.send({
            url: url,
            method: "GET",
            component: component,
            callback: (ret, err) => {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj: ServerResult;
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
    }

    static Register(component: IHttpClientUsing, phone, password, timeZone,  callback: (ret, err) => void) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => AccountCenterApi.Register(component,phone, password, timeZone,  callback), 1000);
            return;
        }

        var url = `${ApiHelper.UrlAddresses.apiUrls.accountCenterUrl}/api/Account/Register`;

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
            callback: (ret, err) => {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj: ServerResult;
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
    }


    /**
     * Checks the phone sms code.
     * @param phone
     * @param smsCode
     * @param sendType 1:register , 2:forget password
     * @param callback
     */
    static CheckPhoneSmsCode(component: IHttpClientUsing,phone: string, smsCode: string, sendType: number , callback: (ret, err) => void) {

        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => AccountCenterApi.CheckPhoneSmsCode(component,phone, smsCode, sendType, callback), 1000);
            return;
        }

        var dict = {
            channelId: ApiHelper.ChannelId,
            phone: phone,
            smsCode: smsCode,
            sendType: sendType
        };

        var url = `${ApiHelper.UrlAddresses.currentUrls.accountCenterUrl}/api/Account/CheckPhoneSmsCode`;

        HttpClient.postJson({
            data: dict,
            url: url,
            component: component,
            callback: (ret, err) => {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj: ServerResult;
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
    }

    /**
     * 获取实名认证状态
     * @param component
     * @param callback
     */
    static GetCertificationStatus(component: Component, callback: (ret: CertificationStatus, err) => void) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => AccountCenterApi.GetCertificationStatus(component,  callback), 1000);
            return;
        }

        

        var url = `${ApiHelper.UrlAddresses.currentUrls.accountCenterUrl}/api/Certification/GetCertificationStatus`;

        HttpClient.postJson({
            method: "GET",
            url: url,
            component: component,
            header: {
                "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
            },
            callback: (ret, err) => {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj: ServerResult;
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
    }

    /**
     * 实名认证
     * @param idCard
     * @param realName
     * @param certificationType 中国：1 其他：2
     * @param areaCode
     * @param callback
     */
    static Certification(component: IHttpClientUsing,idCard: string, realName: string, certificationType: number, areaCode, callback: (ret, err) => void) {

        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => AccountCenterApi.Certification(component,idCard, realName, certificationType, areaCode, callback), 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }

        var dict = {
            channelId: ApiHelper.ChannelId,
            idCard,
            certificationType,
            realName,
            areaCode
        };


        var url = `${ApiHelper.UrlAddresses.currentUrls.accountCenterUrl}/api//Certification/Certification`;

        HttpClient.postJson({
            data: dict,
            url: url,
            component: component,
            header: {
                "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
            },
            callback: (ret, err) => {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj: ServerResult;
                    eval("obj=" + ret);
                    if (obj.code != 200) {
                        callback(null, obj);
                    }
                    else {
                        //进行第二步
                        AccountCenterApi.Certification2(component,idCard, realName, certificationType, areaCode, callback);
                    }
                }
            },
        });
    }

    private static Certification2(component: IHttpClientUsing,idCard: string, realName: string, certificationType: number, areaCode: number, callback: (ret, err) => void) {

        var dict = {
            channelId: ApiHelper.ChannelId,
            realName,
            certificationType,
            areaCode,
            idCard
        };

        var url = `${ApiHelper.UrlAddresses.currentUrls.accountUrl}/api/Userinfo/SetRealNameAuth`;

        HttpClient.postJson({
            data: dict,
            url: url,
            component: component,
            header: {
                "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
            },
            callback: (ret, err) => {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj: ServerResult;
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
    }
}

export interface Country {
    countryName: string;
    countryNameAbbr: string;
    timeZone: string;
}