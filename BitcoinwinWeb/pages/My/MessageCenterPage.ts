import { BaseComponent } from "../../BaseComponent";
import { Component } from "jack-one-script";
import Vue from "vue";
import { showError } from "../../Global";
import { TextRes } from "../../TextRes";
import { ApiHelper, CertificationStatus } from "../../ServerApis/ApiHelper";
import { ForgetPwd } from "../RegisterLogin/ForgetPwd";
import { SetPayPassword } from "./SetPayPassword";
import { AccountApi, UnReadInfo, UserMessageType } from "../../ServerApis/AccountApi";
import { MessageList } from "./MessageList";

var html = require("./messageCenterPage.html");
export class MessageCenterPage extends BaseComponent {
    vm: Vue;
    model = {
        textRes: <TextRes>{},
        unReadInfo: <UnReadInfo>{},
        isBusy:false,
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

    async onNavigationActived(isResume) {
        super.onNavigationActived(isResume);

        this.model.isBusy = true;
        try {
            var ret = await AccountApi.GetUnReadCount(this);

            this.model.unReadInfo = ret;
        }
        catch (e) {
            showError(e);
        }
        finally {
            this.model.isBusy = false;
        }
    }

    userClick() {
        this.recordAction("message_用户提醒");
        navigation.push(new MessageList(UserMessageType.UserMsg));
    }

    activityClick() {
        this.recordAction("message_活动提醒");
        navigation.push(new MessageList(UserMessageType.ActivityMsg));
    }

    systemClick() {
        this.recordAction("message_系统提醒");
        navigation.push(new MessageList(UserMessageType.SystemMsg));
    }
}