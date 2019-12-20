import { BaseComponent, StatusBarStyle } from "../../BaseComponent";
import { Component } from "jack-one-script";
import Vue from "vue";
import { AccountApi } from "../../ServerApis/AccountApi";
import { showError } from "../../Global";
import { MessageCenter, MessageType } from "../../MessageCenter";
import { ApiHelper } from "../../ServerApis/ApiHelper";
import { ModelValidator, ModelValidate, ValidateType } from "jack-one-script";
import { TextRes } from "../../TextRes";
import { AccountCenterApi, Country } from "../../ServerApis/AccountCenterApi";
import { WebBrowser } from "../WebBrowser";
import { alertWindow } from "../../GlobalFunc";


var html = require("./forgetPwd.html");
export class ForgetPwd extends BaseComponent {
    vm: Vue;
    model = {
        textRes: <TextRes>{},
        username: "",
        pwd1: "",
        pwd2:"",
        verifyCode: "",
        isBusy: false,
        agree: false,
        canSendSms : 0,
        validator: {
        },
    };
    get needLogin() {
        return false;
    }
    get statusBarStyle() {
        return StatusBarStyle.Dark;
    }
    constructor() {
        super(html);

        this.model.textRes = (<any>window).textRes;
        this.vm = new Vue({
            el: this.getViewModelElement(),
            data: this.model,
            methods: {
                submit: () => this.submit(),
                sendsms: () => this.sendsms(),
                read_zc: () => this.read_zc(),
                read_fx: () => this.read_fx(),
            },
            watch: {
                verifyCode: (newValue: string) => {
                    if (newValue.length > 6)
                        this.model.verifyCode = newValue.substr(0, 6);
                },
            },
        });

        
    }

    read_zc() {
        var page = new WebBrowser({
            src: `${ApiHelper.ResourceAddress}/RegistrationAgreement.${this.model.textRes.langName.replace("-", "_")}.html`,
            fullScreen: false,
            title: this.model.textRes.items["注册协议"]
        });
        navigation.push(page);
    }

    read_fx() {
        var page = new WebBrowser({
            src: `${ApiHelper.ResourceAddress}/RegistrationAgreement.${this.model.textRes.langName.replace("-", "_")}.html`,
            fullScreen: false,
            title: this.model.textRes.items["风险揭示"]
        });
        navigation.push(page);
    }

    sendsms() {
        if (this.model.canSendSms > 0)
            return;

        var arr: ModelValidate[] = [];
        arr[0] = {
            propertyName: "username",
            validateType: ValidateType.Required
        };

        var result = ModelValidator.verifyToProperty(this.model, arr, "validator");
        if (!result)
            return;

        this.model.isBusy = true;
        AccountCenterApi.SendSmsCode(this, this.model.username, 0, 2, (ret, err) => {
            this.model.isBusy = false;
            if (err)
                showError(err);
            else {
               
                this.changeSeconds();
            }
        });
    }

    changeSeconds() {
        this.model.canSendSms = 60;
        var startime = new Date();
        var action = () => {
            this.model.canSendSms = Math.max(0, 60 - (<any>window).parseInt((new Date().getTime() - startime.getTime()) / 1000));
            if (this.model.canSendSms > 0)
                setTimeout(action, 1000);
        };
        setTimeout(action, 1000);
    }
    
  async  submit() {
        var arr: ModelValidate[] = [
            {
                propertyName: "username",
                validateType: ValidateType.Required
            },
            {
                propertyName: "verifyCode",
                validateType: ValidateType.Required
            },
            {
                propertyName: "pwd1",
                validateType: ValidateType.Required
            },
        ];

        if (this.model.pwd1.length < 8 || this.model.pwd1.length > 16
            || /[0-9]/.test(this.model.pwd1) === false
            || /[a-zA-Z]/.test(this.model.pwd1) === false) {
            await   alertWindow(textRes.items['请输入m密码']);
            return;
        }



       var result = ModelValidator.verifyToProperty(this.model, arr, "validator");
        if (!result)
            return;
        if (this.model.pwd1 != this.model.pwd2) {
            await  alertWindow(this.model.textRes.items["密码确认不一致"]);
            return;
        }

        this.model.isBusy = true;
        AccountCenterApi.CheckPhoneSmsCode(this, this.model.username, this.model.verifyCode, 2, (ret, err) => {
            if (err) {
                this.model.isBusy = false;
                showError(err);
            }
            else {
                AccountCenterApi.ForgetPassword(this, this.model.username, this.model.pwd1,async (ret, err) => {
                    this.model.isBusy = false;
                    if (err)
                        showError(err);
                    else {
                        await   alertWindow(this.model.textRes.items["成功设置密码"]);
                        navigation.pop();
                    }
                });
            }
        });
    }

}