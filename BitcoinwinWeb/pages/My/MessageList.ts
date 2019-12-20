import { BaseComponent } from "../../BaseComponent";
import { Component } from "jack-one-script";
import Vue from "vue";
import { showError } from "../../Global";
import { TextRes } from "../../TextRes";
import { AccountApi, UnReadInfo, UserMessageType, MessageItem } from "../../ServerApis/AccountApi";
import { MessageDetail } from "./MessageDetail";

var html = require("./messageList.html");
export class MessageList extends BaseComponent {
    vm: Vue;
    model = {
        textRes: <TextRes>{},
        isBusy: false,
        title: "",

        datas: <MessageItem[]>[],
        pageNumber: 1,
        hasMore: true,
        dataError: false,
    };

    private msgType: UserMessageType;

    get needLogin() {
        return true;
    }

    constructor(msgtype: UserMessageType) {
        super(html);

        this.model.textRes = textRes;
        this.msgType = msgtype;

        if (msgtype == UserMessageType.ActivityMsg) {
            this.model.title = textRes.items["活动消息"];
        }
        else if (msgtype == UserMessageType.UserMsg) {
            this.model.title = textRes.items["用户消息"];
        }
        else if (msgtype == UserMessageType.SystemMsg) {
            this.model.title = textRes.items["系统消息"];
        }

        this.vm = new Vue({
            el: this.getViewModelElement(),
            data: this.model,
            methods: this.getMethodObjectForVue(),
            computed: {
                moretext: () => {
                    if (this.model.dataError)
                        return textRes.items["点击重新加载"];
                    else if (this.model.isBusy)
                        return textRes.items["正在加载"] + "...";
                    else if (this.model.hasMore)
                        return textRes.items["加载更多"];
                    else if (this.model.datas.length == 0)
                        return textRes.items["目前还没有数据"];
                    else
                        return textRes.items["没有更多数据了"];

                },
            },
        });
    }

    onNavigationPushed() {
        super.onNavigationPushed();

        this.loadData();
    }

    loadData() {
        if (this.model.isBusy || this.model.hasMore == false)
            return;

        this.model.isBusy = true;
        this.model.dataError = false;

        if (this.model.pageNumber == 1) {
            this.model.datas = [];
            this.model.hasMore = true;
        }

        AccountApi.GetUserMessageList(this, this.msgType, this.model.pageNumber, 30, (ret, err) => {
            this.model.isBusy = false;
            if (err) {
                this.model.dataError = true;
                showError(err);
            }
            else {
   
                this.model.pageNumber++;
                for (var i = 0; i < ret.length; i++) {
                    this.model.datas.push(ret[i]);
                }
                this.model.hasMore = ret.length == 30;
            }
        });
    }
    loadMore() {
        this.loadData();
    }

    itemClick(item: MessageItem) {
        navigation.push(new MessageDetail(this.model.title , item));
    }

}