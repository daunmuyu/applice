import { BaseComponent } from "../../BaseComponent";
import { Component } from "jack-one-script";
import Vue from "vue";
import { AccountInfo, AccountApi, TradeAssetsInfo } from "../../ServerApis/AccountApi";
import { showError } from "../../Global";
import { MessageCenter, MessageType } from "../../MessageCenter";

import { TextRes } from "../../TextRes";
import { FriendList } from "./FriendList";
import { ShareInComeList } from "../Assets/DetailLists/ShareInComeList";
import { ApiHelper } from "../../ServerApis/ApiHelper";
import { shareImage, shareImageReview, alertWindow } from "../../GlobalFunc";
import { Home } from "../Home";

var qrcode = require("qrcode");

var html = require("./popularize.html");
export class Popularize extends BaseComponent {
    vm: Vue;
    model = {
        isBusy: 0,
        textRes: <TextRes>{},
        isShowedPanel: undefined,
        tradeAssetInfo: <TradeAssetsInfo>{},
        accountInfo: <AccountInfo>{
            "accountMoneyInfo":
            {
            }
        }
    };

    get needLogin() {
        return true;
    }

    loginedAction: (p) => void;
    constructor() {
        super(html);

        this.model.textRes = textRes;
        this.vm = new Vue({
            el: this.getViewModelElement(),
            data: this.model,
            methods: this.getMethodObjectForVue(),
        });

        this.loginedAction = (p) => {
            this.loaddata();
        };
        MessageCenter.register(MessageType.Logined, this.loginedAction);
    }

    showPanel() {
        if (this.model.isShowedPanel == undefined)
            this.model.isShowedPanel = false;
        this.model.isShowedPanel = !this.model.isShowedPanel;

    }

    onNavigationPushed() {
        super.onNavigationPushed();

        this.getTradeAssetsInfo();
        this.loaddata();
    }
    friendList() {
        navigation.push(new FriendList());
    }
    friendInComeList() {
        //navigation.push(new ShareInComeList(undefined));
    }
    onNavigationPoped() {
        super.onNavigationPoped();
        
        MessageCenter.unRegister(MessageType.Logined, this.loginedAction);
    }
    async screenShot() {
        if (this.model.isBusy)
            return;

        this.model.isBusy++;

        var url;
        try {
            url = encodeURIComponent(Home.AccountInfo.accountMoneyInfo.registerurl);
        }
        catch (e) {
            try {
                var ret = await AccountApi.GetAccountInfo(this);
                Home.AccountInfo = ret;
                url = encodeURIComponent(ret.accountMoneyInfo.registerurl);
            }
            catch (e) {
                showError(e);
                this.model.isBusy--;
                return;
            }
        }

        var module = window.api.require('kLine');
        console.log(`${ApiHelper.ResourceAddress}/share/${textRes.langName.replace("-", "_")}/tuiguang.html?url=${url}`);

        module.saveWebImage({
            w: 750,
            h: 1285,
            waitForReady: true,
            url: `${ApiHelper.ResourceAddress}/share/${textRes.langName.replace("-", "_")}/tuiguang.html?url=${url}`,
        }, (ret, err) => {

            if (err) {
                this.model.isBusy--;
                if (this.actived)
                    showError(err);
            }
            else if (ret.status == 1) {
                this.model.isBusy--;

                if (this.actived)
                    shareImageReview(ret.data);
            }
        });        
    }

    async trans2account() {

        if (this.model.isBusy)
            return;
        this.model.isBusy++;
        try {
            var amount = this.model.accountInfo.accountMoneyInfo.canusedincome;
            var ret = await AccountApi.CanusedIncomeTransferCanusedAmount(this, amount);

            this.model.accountInfo.accountMoneyInfo.canusedincome -= amount;
            await  alertWindow(textRes.items["成功转入"]);
        }
        catch (e) {
            showError(e);
        }
        finally {
            this.model.isBusy--;
        }
    }

    getContentText() {
        try {
            if (this.model.accountInfo.accountMoneyInfo.distributionFirstTradeCommission == undefined) {
                return "";
            }
            if (this.model.accountInfo.accountMoneyInfo.distributionFirstTradeCommission > 0) {
                return (<any>textRes).getItem('推广员升级规则_内容_VIP',
                    this.model.tradeAssetInfo.distributionIncome.inviteFriendsAnnual + "%", this.model.tradeAssetInfo.distributionIncome.friendsShareGiftsAnnual + "%",
                    this.model.tradeAssetInfo.distributionIncome.inviteFriendsCommissionRate + "%", this.model.tradeAssetInfo.distributionIncome.friendsShareGiftsCommissionRate + "%").replace(/\n/g, '<br>');
            }
            else {
                return (<any>textRes).getItem('推广员升级规则_内容', this.model.tradeAssetInfo.distributionIncome.inviteFriendsAnnual + '%', this.model.tradeAssetInfo.distributionIncome.friendsShareGiftsAnnual+ '%').replace(/\n/g, '<br>');
            }
        }
        catch (e) {
            return "";
        }
    }

    async loaddata() {
        this.model.isBusy++;
        try {
            var ret = await AccountApi.GetAccountInfo(this);

            MessageCenter.unRegister(MessageType.Logined, this.loginedAction);
            this.model.accountInfo = ret;

            if (this.model.isShowedPanel == undefined && this.model.accountInfo.accountMoneyInfo.totalfriendcount > 0) {
                this.model.isShowedPanel = true;
            }

            var ele = <HTMLElement>this.element.querySelector("#canvgQrcode");
            qrcode.toCanvas(ele,
                this.model.accountInfo.accountMoneyInfo.registerurl,
                {
                    width: ele.offsetWidth,
                    height: ele.offsetHeight,
                    margin: 0,
                },
                function (error) {
                    if (error)
                        showError(error);
                });

        }
        catch (e) {
            showError(e);
        }
        finally {
            this.model.isBusy--;
        }
    }

    getTradeAssetsInfo() {
        this.model.isBusy ++;
        AccountApi.GetTradeAssetsInfo(this, (ret, err) => {

            if (err) {
                setTimeout(() => this.getTradeAssetsInfo(), 1000);
            }
            else {
                console.log(JSON.stringify(ret));
                this.model.isBusy--;
                this.model.tradeAssetInfo = ret;
            }
        });
    }

}