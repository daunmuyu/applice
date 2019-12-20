import { BaseComponent } from "../../BaseComponent";
import { Component } from "jack-one-script";
import Vue from "vue";
import { showError } from "../../Global";
import { TextRes } from "../../TextRes";
import { alertWindow, getCache, setCache, removeCache } from "../../GlobalFunc";
import { fail } from "assert";
import { isArray } from "util";
import { AlertWindow } from "../General/AlertWindow";
import { CommodityDetail } from "./CommodityDetail";
import { parse } from "querystring";

var html = require("./klineSetting.html");
var KLineOptionSettingKeyName = "klineOptionSetting";
var defaultMaColors = ["#35c8b1", "#e7b574", "#cf16d2", "#647DCF", "#F3A365", "#E2626E"];

export interface KLINEOPTION {
    maItems: any[];
    maItemSelects: any[];
    boll_n: number;
    boll_k: number;
    macd_s: number;
    macd_l: number;
    macd_m: number;
    kdj_cycle: number;
    rsi_N: any[];
    rsiSelects: any[];
    wr_N: any[];
    wrSelects: any[];
}

export class KlineSetting extends BaseComponent {
    vm: Vue;
    detailPage: CommodityDetail;
    model = {
        textRes: <TextRes>{},
        tabs: [
            { text: "MA", selected: true },
            { text: "BOLL", selected: false },
            { text: "MACD", selected: false },
            { text: "KDJ", selected: false },
            { text: "RSI", selected: false },
            { text: "WR", selected: false }
        ],
        option: <KLINEOPTION>{},
        isBusy:false,
    };
    get needLogin() {
        return false;
    }

    static get defaultOption(): KLINEOPTION {
        return {
            maItems: ["5", "10", "30","","",""],
            maItemSelects: [true, true, true, false, false, false],
            boll_n: 20,
            boll_k: 2,

            macd_s: 12,
            macd_l: 26,
            macd_m: 9,
            kdj_cycle: 9,

            rsi_N: ["6", "12", "24"],
            rsiSelects: [true, true, true],
            wr_N: ["10", "6"],
            wrSelects: [true, true],
        };
    }

    /** 根据用户设置，获取k线指标设置值 */
    static get lineViewOption() {
        var option = getCache(KLineOptionSettingKeyName);
        if (option) {
            option = JSON.parse(option);
        }
        else {
            option = {};
        }

        //ma相关
        if (option.maItemSelects) {
            var maItems = [];
            option.maColors = [];
            for (var i = 0; i < option.maItemSelects.length; i++) {
                if (option.maItemSelects[i] && option.maItems[i]) {
                    maItems.push(parseInt( option.maItems[i]));
                    option.maColors.push(defaultMaColors[i]);
                }
            }
            option.maItems = maItems;
        }

        if (option.macd_s != undefined)
            option.macdConfig = [parseInt( option.macd_s), parseInt( option.macd_l), parseInt( option.macd_m)];

        //rsi相关
        if (option.rsiSelects) {
            var rsi_N = [];
            for (var i = 0; i < option.rsiSelects.length; i++) {
                if (option.rsiSelects[i] && option.rsi_N[i]) {
                    rsi_N.push(parseInt(option.rsi_N[i]));
                }
            }
            option.rsi_N = rsi_N;
        }

        //wr相关
        if (option.wrSelects) {
            var wr_N = [];
            for (var i = 0; i < option.wrSelects.length; i++) {
                if (option.wrSelects[i] && option.wr_N[i]) {
                    wr_N.push(parseInt(option.wr_N[i]));
                }
            }
            option.wr_N = wr_N;
        }
        return option;
    }

    constructor(detailPage: CommodityDetail) {
        super(html);

        this.detailPage = detailPage;
        this.model.textRes = textRes;

        if (getCache(KLineOptionSettingKeyName)) {
            this.model.option = JSON.parse(getCache(KLineOptionSettingKeyName));
        }
        var defaultOption = KlineSetting.defaultOption;
        for (var p in defaultOption) {
            if (this.model.option[p] === undefined) {
                this.model.option[p] = defaultOption[p];
            }
        }

        this.vm = new Vue({
            el: this.getViewModelElement(),
            data: this.model,
            methods: this.getMethodObjectForVue(),
            computed: {
                selectedTab: () => {
                    return this.model.tabs.find(m => m.selected);
                },
                selectedMaText: () => {
                    var ret = "";
                    for (var i = 0; i < this.model.option.maItemSelects.length; i++) {
                        if (this.model.option.maItemSelects[i] && this.model.option.maItems[i]) {
                            if (ret.length > 0)
                                ret += "&nbsp;&nbsp;&nbsp;&nbsp;";
                            ret += "MA" + this.model.option.maItems[i];
                        }
                    }
                    return ret;
                },
                selectedBollText: () => {
                    return `N${this.model.option.boll_n}&nbsp;&nbsp;&nbsp;&nbsp;K${this.model.option.boll_k}`;
                },
                selectedMacdText: () => {
                    return `MACD(${this.model.option.macd_s},${this.model.option.macd_l},${this.model.option.macd_m})`;
                },
                selectedRsiText: () => {
                    var ret = "";
                    for (var i = 0; i < this.model.option.rsiSelects.length; i++) {
                        if (this.model.option.rsiSelects[i] && this.model.option.rsi_N[i]) {
                            if (ret.length > 0)
                                ret += "&nbsp;&nbsp;&nbsp;&nbsp;";
                            ret += "N" + this.model.option.rsi_N[i];
                        }
                    }
                    return ret;
                },
                selectedWrText: () => {
                    var ret = "";
                    for (var i = 0; i < this.model.option.wrSelects.length; i++) {
                        if (this.model.option.wrSelects[i] && this.model.option.wr_N[i]) {
                            if (ret.length > 0)
                                ret += "&nbsp;&nbsp;&nbsp;&nbsp;";
                            ret += "N" + this.model.option.wr_N[i];
                        }
                    }
                    return ret;
                },
            }
        });
    }
    
    async save() {
        setCache(KLineOptionSettingKeyName, JSON.stringify(this.model.option));
        await alertWindow(textRes.items['成功保存']);
        if (this.detailPage) {
            this.detailPage.resetOptionForSetting();
        }
        //alert(JSON.stringify(KlineSetting.lineViewOption));
        //removeCache(KLineOptionSettingKeyName);
    }

    maItemSelect(index) {
        this.vm.$set(this.model.option.maItemSelects, index, !this.model.option.maItemSelects[index]);
        
    }
    rsiSelect(index) {
        this.vm.$set(this.model.option.rsiSelects, index, !this.model.option.rsiSelects[index]);

    }
    wrSelect(index) {
        this.vm.$set(this.model.option.wrSelects, index, !this.model.option.wrSelects[index]);

    }
    resetMa() {
        var defaultOption = KlineSetting.defaultOption;
        this.model.option.maItems = defaultOption.maItems;
        this.model.option.maItemSelects = defaultOption.maItemSelects;
    }
    resetRsi() {
        var defaultOption = KlineSetting.defaultOption;
        this.model.option.rsiSelects = defaultOption.rsiSelects;
        this.model.option.rsi_N = defaultOption.rsi_N;
    }
    resetWr() {
        var defaultOption = KlineSetting.defaultOption;
        this.model.option.wrSelects = defaultOption.wrSelects;
        this.model.option.wr_N = defaultOption.wr_N;
    }
    resetMacd() {
        var defaultOption = KlineSetting.defaultOption;
        this.model.option.macd_s = defaultOption.macd_s;
        this.model.option.macd_l = defaultOption.macd_l;
        this.model.option.macd_m = defaultOption.macd_m;
    }
    resetBoll() {
        var defaultOption = KlineSetting.defaultOption;
        this.model.option.boll_n = defaultOption.boll_n;
        this.model.option.boll_k = defaultOption.boll_k;
    }
    resetKdj() {
        var defaultOption = KlineSetting.defaultOption;
        this.model.option.kdj_cycle = defaultOption.kdj_cycle;
    }
    clickTab(tab) {
        this.model.tabs.forEach(item => {
            item.selected = item === tab;
        });
    }
}