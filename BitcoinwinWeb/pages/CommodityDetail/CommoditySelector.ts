import { BaseComponent, StatusBarStyle } from "../../BaseComponent";
import { Component } from "jack-one-script";
import Vue from "vue";
import { Description, ApiHelper } from "../../ServerApis/ApiHelper";
import { MarketApi } from "../../ServerApis/MarketApi";
import { Main } from "../../Main";

var html = require("./commoditySelector.html")
export class CommoditySelector extends BaseComponent {
    vm: Vue;
    divLeftMenu: HTMLElement;
    model = {
        safeAreaTop: "",
        otherCommdities: [],
        textRes: {},
    };
    get needLogin() {
        return false;
    }

    get statusBarStyle() {
        return StatusBarStyle.None;
    }

    private canRefresh = false;

    constructor(param) {
        super(html);


        if ((<any>window).api) {
            this.model.safeAreaTop = (<any>window).api.safeArea.top + "px";
        }
        this.model.textRes = (<any>window).textRes; 
        this.model.otherCommdities = param.commodities;

        this.vm = new Vue({
            el: this.getViewModelElement(),
            data: this.model,
            methods: this.getMethodObjectForVue(),
        });
        this.divLeftMenu = this.element.querySelector("#divLeftMenu");

    }

    onNavigationPushed() {
        super.onNavigationPushed();
        this.showMenu();
    }

    showMenu() {
        Component.setBodyDisabled(true);
        this.animationFuncEnd = () => {
           
            Component.setBodyDisabled(false);

            this.divLeftMenu.style.transform = "translate3d(0%,0px,0)";
            this.divLeftMenu.style.animation = "";
            this.divLeftMenu.style.webkitAnimation = "";
            this.divLeftMenu.style.animationFillMode = "";
            this.divLeftMenu.style.webkitAnimationFillMode = "";

            // Chrome, Safari 和 Opera 代码
            this.divLeftMenu.removeEventListener("webkitAnimationEnd", this.animationFuncEnd);
            // 标准语法
            this.divLeftMenu.removeEventListener("animationend", this.animationFuncEnd);

            this.canRefresh = true;
            this.refreshPrice();
        };

        // Chrome, Safari 和 Opera 代码
        this.divLeftMenu.addEventListener("webkitAnimationEnd", this.animationFuncEnd);
        // 标准语法
        this.divLeftMenu.addEventListener("animationend", this.animationFuncEnd);

        this.divLeftMenu.style.animation = "_commoditySelector_keyframe 0.25s linear";
        this.divLeftMenu.style.webkitAnimation = "_commoditySelector_keyframe 0.25s linear";
        this.divLeftMenu.style.animationFillMode = "forwards";//这两句代码必须放在animation赋值的后面
        this.divLeftMenu.style.webkitAnimationFillMode = "forwards";
    }

    private animationFuncEnd: () => void;
    hideMenu() {
        this.canRefresh = false;
        Component.setBodyDisabled(true);
        this.animationFuncEnd = () => {
            Component.setBodyDisabled(false);
            this.divLeftMenu.style.transform = "translate3d(-99%,0px,0)";
            this.divLeftMenu.style.animation = "";
            this.divLeftMenu.style.webkitAnimation = "";
            this.divLeftMenu.style.animationFillMode = "";
            this.divLeftMenu.style.webkitAnimationFillMode = "";
            // Chrome, Safari 和 Opera 代码
            this.divLeftMenu.removeEventListener("webkitAnimationEnd", this.animationFuncEnd);
            // 标准语法
            this.divLeftMenu.removeEventListener("animationend", this.animationFuncEnd);

            Main.layer.hide();
        };

        // Chrome, Safari 和 Opera 代码
        this.divLeftMenu.addEventListener("webkitAnimationEnd", this.animationFuncEnd);
        // 标准语法
        this.divLeftMenu.addEventListener("animationend", this.animationFuncEnd);

       


        this.divLeftMenu.style.animation = "_commoditySelector_keyframe2 0.25s linear";
        this.divLeftMenu.style.webkitAnimation = "_commoditySelector_keyframe2 0.25s linear";
        this.divLeftMenu.style.animationFillMode = "forwards";//这两句代码必须放在animation赋值的后面
        this.divLeftMenu.style.webkitAnimationFillMode = "forwards";
    }

    otherClick(item: Description) {
        (<any>window).api.sendEvent({
            name: 'changeCommodity',
            extra: {
                symbol: item.symbol
            }
        });
    }

    private refreshPrice() {
        console.log("行情刷新价格 at selector..." + (<Description>this.model.otherCommdities[0]).commoditytype);

        MarketApi.GetPrice(null,(<Description>this.model.otherCommdities[0]).commoditytype, (ret, err) => {
            if (!this.canRefresh)
                return;
            if (err) {
            }
            else {

                ret.forEach((item) => {
                    var commodity = ApiHelper.getDescriptionByList(item.symbol, this.model.otherCommdities);
                    if (commodity) {
                        commodity.bidPrice = item.bidPrice;
                        commodity.preClose = item.preClose;
                        commodity.tradestatus = item.tradestatus;
                        commodity.status = item.status;

                        var upv = (item.bidPrice - item.preClose);
                        if (upv >= 0)
                            commodity.updownValue = "+" + upv.toFixed(commodity.decimalplace);
                        else
                            commodity.updownValue = upv.toFixed(commodity.decimalplace);

                        var percent = (upv * 100) / item.preClose;
                        if (percent >= 0) {
                            commodity.isDown = false;
                            commodity.percent = "+" + percent.toFixed(2) + "%";
                        }
                        else {
                            commodity.isDown = true;
                            commodity.percent = percent.toFixed(2) + "%";
                        }
                    }
                });
            }

            if (this.canRefresh) {
                setTimeout(() => this.refreshPrice(), 3000);
            }
        });
    }
}