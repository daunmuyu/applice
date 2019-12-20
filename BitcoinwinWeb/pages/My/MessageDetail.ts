import { BaseComponent } from "../../BaseComponent";
import { Component } from "jack-one-script";
import Vue from "vue";
import { showError } from "../../Global";
import { TextRes } from "../../TextRes";
import { AccountApi, UnReadInfo, UserMessageType, MessageItem } from "../../ServerApis/AccountApi";

var html = require("./messageDetail.html");
export class MessageDetail extends BaseComponent {
    vm: Vue;
    model = {
        textRes: <TextRes>{},
        isBusy: false,
        title: "",
        msgitem: <MessageItem>null,
    };

    private msgType: UserMessageType;

    get needLogin() {
        return true;
    }

    constructor(title: string, msg: MessageItem) {
        super(html);

        this.model.textRes = textRes;
        this.model.msgitem = msg;
        this.model.title = title;

        this.vm = new Vue({
            el: this.getViewModelElement(),
            data: this.model,
            methods: this.getMethodObjectForVue(),
        });
    }

    onNavigationPushed() {
        super.onNavigationPushed();

        this.model.isBusy = true;
        AccountApi.GetUserMessage(this, this.model.msgitem.id, (ret, err) => {
            this.model.isBusy = false;
            if (err)
                showError(err);
            else {
                this.model.msgitem.status = 1;
                this.model.msgitem.content = ret.content;
            }
        });
    }

}