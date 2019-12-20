import { BaseComponent, StatusBarStyle } from "../../BaseComponent";
import Vue from "vue";
import { TextRes } from "../../TextRes";
import { TradeHistory } from "../Position/TradeHistory";

import { Navigation, HttpClient } from "jack-one-script";
import { Quotation } from "../Quotation";
import { fail } from "assert";
import { Position } from "../Position/Position";
import { ApiHelper } from "../../ServerApis/ApiHelper";

var html = require("./demoTrade.html");
class Tab {
    title: string;
    selected: boolean;
    component: BaseComponent;
}

export class DemoTrade extends BaseComponent {
    static instance: DemoTrade;
    vm: Vue;
    myNavi: Navigation;
    quotation: Quotation;
    position: Position;
    model = {
        textRes: <TextRes>{},
        safeAreaTop:"",
        isBusy: false,
        tabs: <Tab[]>[],
    };
    get needLogin() {
        return true;
    }
    get statusBarStyle()
    {
        return StatusBarStyle.Light;
    }
    get title(): string {
        return "模拟交易";
    }
    constructor() {
        super(html);
        DemoTrade.instance = this;

        HttpClient.defaultHeaders["IsDemo"] = "1";
        ApiHelper.UrlAddresses.currentUrls = ApiHelper.UrlAddresses.demoApiUrls;
        if (window.api) {
            
            window.api.sendEvent({
                name: 'DemoIn',
                extra: {
                    mode:true,
                }
            });
        }

        this.model.textRes = textRes;
        if (window.api) {
            this.model.safeAreaTop = window.api.safeArea.top + "px";
        }
        this.model.tabs = [
            {
            title: textRes.items["模拟行情"],
                selected: true,
                component: new Quotation(false)
            },
            {
                title: textRes.items["模拟持仓"],
                selected: false,
                component: new Position(false)
            }
        ];

        this.vm = new Vue({
            el: this.getViewModelElement(),
            data: this.model,
            methods: this.getMethodObjectForVue(),
        });

        this.myNavi = new Navigation();
        this.myNavi.element.style.left = "0px";
        this.myNavi.element.style.top = "0px";
        this.myNavi.element.style.width = "100%";
        this.myNavi.element.style.height = "100%";
        this.myNavi.element.style.position = "absolute";
        this.myNavi.setParent(this.element.querySelector("#main"));

        this.myNavi.push(this.model.tabs[1].component, false);
        this.myNavi.push(this.model.tabs[0].component, false);
    }


    /**切换到行情页 */
    activeQuotation() {
        for (var i = 0; i < this.model.tabs.length; i++) {
            if (this.model.tabs[i].component.constructor === Quotation) {
                this.tabClick(this.model.tabs[i]);
                break;
            }
        }
    }
/**切换到持仓页 */
    activePosition() {
        for (var i = 0; i < this.model.tabs.length; i++) {
            if (this.model.tabs[i].component.constructor === Position) {
                this.tabClick(this.model.tabs[i]);
                break;
            }
        }
    }
    tabClick(tab: Tab) {
        this.model.tabs.forEach((item) => {
            item.selected = item === tab;
        });
        this.myNavi.bringToFront(tab.component);
    }
    backClick() {
        navigation.pop();
    }
    tradeHistoryClick() {
        navigation.push(new TradeHistory());
    }

    onNavigationUnActived(isPoping: boolean) {
        if (isPoping) {
            this.myNavi.pop(false);
            this.myNavi.pop(false);
            this.myNavi.dispose();

            ApiHelper.UrlAddresses.currentUrls = ApiHelper.UrlAddresses.apiUrls;
        }

        super.onNavigationUnActived(isPoping);
    }
    onBeforeNavigationPoped() {
        super.onBeforeNavigationPoped();

        delete (<any>HttpClient.defaultHeaders).IsDemo;
        if (window.api) {
            window.api.sendEvent({
                name: 'DemoIn',
                extra: {
                    mode: false,
                }
            });
        }
    }
    onNavigationPoped() {
        super.onNavigationPoped();

        DemoTrade.instance = undefined;
        
    }
}