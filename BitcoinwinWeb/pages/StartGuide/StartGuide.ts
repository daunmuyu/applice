import { BaseComponent } from "../../BaseComponent";
import { Swiper } from "jack-one-script";
import Vue from "vue";

var html = require("./startGuide.html");
export class StartGuide extends BaseComponent {
    swiper: Swiper;
    vm: Vue;
    model = {
        textRes:null,
        isEnd : false
    };
    action: () => void;
    constructor(action:()=>void) {
        super(html);

        this.action = action;
        this.model.textRes = textRes;

        this.vm = new Vue({
            el: this.getViewModelElement(),
            methods: this.getMethodObjectForVue(),
            data: this.model,
        });

        this.element.style.position = "absolute";
        this.element.style.left = "0px";
        this.element.style.top = "0px";
    }

    onViewReady() {
        super.onViewReady();

        var html1 = require("./1.html").replace("{{1}}", textRes.items["法币入金出金流程快捷安全"])
            .replace("{{2}}", textRes.items["推荐好友可获丰厚返利"]);
        var html2 = require("./2.html").replace("{{1}}", textRes.getItem("交易保证金年化收益n","25%"))
            .replace("{{2}}", textRes.items["低至10USDT一手"]);
        var html3 = require("./3.html").replace("{{1}}", textRes.items["不发币"])
            .replace("{{2}}", textRes.items["只服务主流数字资产"]);

        this.swiper = new Swiper(this.element.querySelector("#main"), {
            autoPlayInterval: 0,
            borderRadius: 0,
            defaultScale: 1,
            imgPaths: [html1, html2, html3],
            imgHeight: 0,
            imgWidth: 0,
            canRepeat: false,
            paginationBgColor: "#D8D8D8",
            paginationBottom: (<any>window).parseInt(1.05 * (<any>window).__remConfig_flag),
            paginationCurrentBgColor: "#EA3131",
            paginationMargin: (<any>window).parseInt(0.33 * (<any>window).__remConfig_flag),
            paginationSize: (<any>window).parseInt(0.3 * (<any>window).__remConfig_flag),
            showPagination: true,
        });
        this.swiper.currentIndexChange = (s, index) => {
            this.model.isEnd = index === 2;
        };
    }

    endClick() {
        this.swiper.dispose();
        this.dispose();
        if (this.action) {
            this.action();
        }
        
    }
}