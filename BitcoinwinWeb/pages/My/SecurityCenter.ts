import { BaseComponent } from "../../BaseComponent";
import { TextRes } from "../../TextRes";
import Vue from "vue";
import { ApiHelper, CertificationStatus } from "../../ServerApis/ApiHelper";
import { RealName } from "./RealName";
import { Home } from "../Home";
import { AccountApi } from "../../ServerApis/AccountApi";
import { showError } from "../../Global";
import { SetPayPassword } from "./SetPayPassword";
import { ForgetPwd } from "../RegisterLogin/ForgetPwd";
import { setCache, getCache, alertWindow } from "../../GlobalFunc";
import { EnterPassword } from "../General/EnterPassword";
import { Login } from "../RegisterLogin/Login";
var html = require("./securityCenter.html");
export class SecurityCenter extends BaseComponent
{
    vm: Vue;
    model = {
        textRes: <TextRes>{},
        /**安全等级，0-100*/
        safetyLevel: 10,
        phone_number: "",
        certificationstatus: "",
        certificationAuditing:false,
        certificationSuccess: false,
        canCertification: false,
        isSetedPayPassword: false,
        /**是否开启指纹登录*/
        activeFinger:false,
        isBusy: false,
    };

    constructor() {
        super(html);

        this.model.textRes = textRes;

        this.model.activeFinger = getCache("UseFinger") === "1";
        if (this.model.activeFinger) {
            this.model.safetyLevel = Math.min(100, this.model.safetyLevel + 30);
        }

        this.vm = new Vue({
            el: this.getViewModelElement(),
            methods: this.getMethodObjectForVue(),
            data: this.model,
            watch: {
                isSetedPayPassword: (newValue) => {
                    if (newValue)
                        this.model.safetyLevel = Math.min(100, this.model.safetyLevel + 30);
                },
                activeFinger:async (newValue, oldValue) => {
                    if (newValue) {
                        this.model.safetyLevel = Math.min(100, this.model.safetyLevel + 30);
                        if (window.api) {
                            var touchID = window.api.require('jackTouchId');

                            touchID.isValid(async (ret,err)=> {
                                if (ret.status) {
                                    setCache("UseFinger", "1");
                                    setCache("FingerInfo", ApiHelper.CurrentTokenInfo.refresh_token);
                                    this.fingerLogin();
                                } else {
                                    await  alertWindow(textRes.items['您的设备不支持指纹识别功能,或者您还没有在您的手机里录入指纹']);
                                    this.model.activeFinger = false;
                                }
                            });
                        }
                        else {
                            await  alertWindow(textRes.items['您的设备不支持指纹识别功能,或者您还没有在您的手机里录入指纹']);
                            this.model.activeFinger = false;
                        }
                        
                    }
                    else {
                        this.model.safetyLevel = Math.min(100, this.model.safetyLevel - 30);
                        setCache("UseFinger", "0");
                        setCache("FingerInfo", "");
                    }
                },
            },
        });

       

        this.checkStatus();
    }

    fingerLogin() {
        var login = new Login();
        login.callback = (err) => {
            if (err) {
                this.model.activeFinger = false;
            }
        };
        navigation.push(login);
    }

    activeFingerClick() {
        if (this.model.activeFinger) {
            this.model.activeFinger = false;
        }
        else {
            navigation.push(new EnterPassword(async (pwd) => {
                this.model.isBusy = true;
                try {
                    await AccountApi.Login(this, ApiHelper.CurrentTokenInfo.phone_number, pwd, ApiHelper.CurrentTokenInfo.autologin);
                    this.model.activeFinger = true;
                }
                catch (e) {
                    showError(e);
                }
                finally {
                    this.model.isBusy = false;
                }
            }));
        }
    }


    async checkStatus() {
        if (ApiHelper.CurrentTokenInfo) {
            this.model.phone_number = ApiHelper.CurrentTokenInfo.phone_number;

            if (ApiHelper.CurrentTokenInfo.certificationstatus == CertificationStatus.CertificationSuccess) {
                this.model.certificationstatus = textRes.items["已认证"];
                this.model.certificationSuccess = true;
                this.model.safetyLevel = Math.min(100, this.model.safetyLevel + 30);
            }
            else if (ApiHelper.CurrentTokenInfo.certificationstatus == CertificationStatus.CertificationFail) {
                this.model.certificationstatus = textRes.items["认证失败"];
                this.model.canCertification = true;
            }
            else if (ApiHelper.CurrentTokenInfo.certificationstatus == CertificationStatus.CertificationAuditing) {
                this.model.certificationstatus = textRes.items["审核中..."];
                this.model.certificationAuditing = true;
            }
            else if (ApiHelper.CurrentTokenInfo.certificationstatus == CertificationStatus.Uncertified || ApiHelper.CurrentTokenInfo.certificationstatus == undefined) {
                this.model.certificationstatus = textRes.items["未认证"];
                this.model.canCertification = true;
            }
        }

        if (Home.AccountInfo) {
            this.model.isSetedPayPassword = Home.AccountInfo.accountMoneyInfo.issetpassword;
            
        }
        else {
            this.model.isBusy = true;
            try {
                var info = await AccountApi.GetAccountInfo(this);
                this.model.isSetedPayPassword = info.accountMoneyInfo.issetpassword;
            }
            catch (e) {
                showError(e);
            }
            finally {
                this.model.isBusy = false;
            }
        }
    }

    realNameClick() {

        if (ApiHelper.CurrentTokenInfo.certificationstatus == undefined ||
            ApiHelper.CurrentTokenInfo.certificationstatus == CertificationStatus.Uncertified || ApiHelper.CurrentTokenInfo.certificationstatus == CertificationStatus.CertificationFail)
            navigation.push(new RealName());
    }

    setPayPwdClick() {
        navigation.push(new SetPayPassword());
    }

    modifyPwdClick() {
        navigation.push(new ForgetPwd());
    }

}