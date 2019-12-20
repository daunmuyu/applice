import { BaseComponent } from "../../BaseComponent";
import { Component } from "jack-one-script";
import Vue from "vue";
import { showError } from "../../Global";
import { TextRes } from "../../TextRes";
import { ApiHelper, CertificationStatus } from "../../ServerApis/ApiHelper";
import { ForgetPwd } from "../RegisterLogin/ForgetPwd";
import { AccountCenterApi } from "../../ServerApis/AccountCenterApi";
import { AccountApi } from "../../ServerApis/AccountApi";
import { EnterPayPassword } from "../General/EnterPayPassword";
import { Home } from "../Home";
import { alertWindow } from "../../GlobalFunc";

var html = require("./setPayPassword.html");
export class SetPayPassword extends BaseComponent {
    vm: Vue;
    model = {
        textRes: <TextRes>{},
        isBusy: false,
        canSendSms: 0,
        password: "",
        password2: "",
        smscode:"",
    };
    get needLogin() {
        return true;
    }

    constructor() {
        super(html);

        this.model.textRes = textRes;
        
        this.vm = new Vue({
            el: this.getViewModelElement(),
            data: this.model,
            methods: this.getMethodObjectForVue(),
        });
    }

    async sendSms() {
        if (this.model.canSendSms > 0)
            return;

        this.model.isBusy = true;
        try {
            await AccountApi.SendSetPayPwdSms(this);
            this.changeSeconds();
        }
        catch (e) {
            showError(e);
        }
        finally {
            this.model.isBusy = false;
        }
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

   async submit() {
        if (this.model.password.length != 6) {
            await  alertWindow(textRes.getItem("请输入n位支付密码", 6));
            return;
        }
        if (this.model.smscode.length != 6) {
            await  alertWindow(textRes.getItem("请输入n位验证码", 6));
            return;
        }
        navigation.push(new EnterPayPassword(textRes.items["请再次输入新密码"],false,async (pwd) => {
            this.model.password2 = pwd;

            if (this.model.password2.length === 6) {
                navigation.pop(false);
                if (this.model.password != this.model.password2) {
                    await  alertWindow(textRes.items["支付密码确认不一致"]);
                }
                else {
                    this.model.isBusy = true;

                    try {
                        await AccountApi.SetUserPassword(this, this.model.password, this.model.smscode);

                        if (Home.AccountInfo)
                            Home.AccountInfo.accountMoneyInfo.issetpassword = true;
                        await  alertWindow(textRes.items["成功设置支付密码"]);
                        navigation.pop();
                    }
                    catch (e) {
                        showError(e);
                    }
                    finally {
                        this.model.isBusy = false;
                    }
                }
            }
        }) , false);
       
    }

}