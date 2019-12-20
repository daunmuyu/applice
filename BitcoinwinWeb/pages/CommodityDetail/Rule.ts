import { BaseComponent } from "../../BaseComponent";
import Vue from "vue";
import { ApiHelper, Description } from "../../ServerApis/ApiHelper";
import { setTimeout } from "timers";
import { HttpClient } from "jack-one-script";
import { showError } from "../../Global";
var html = require("./rule.html");

export class Rule extends BaseComponent {
    vm: Vue;
    model = {
        commodity: <Description>null,
        isBusy: false,
        textRes: null,
        items: [],
        tips:"",
    };

    get needLogin() {

        return false;
    }
    constructor(commodity: Description) {
        super(html);

        this.model.textRes = textRes;
        this.model.commodity = <any>{};
        for (var p in commodity) {
            this.model.commodity[p] = commodity[p];
        }

        if (this.model.commodity.symbolnameen === "DAPPPRO")
            this.model.commodity.marketsymbol = "DAPPPROUSDT";
        this.model.commodity.symbol = this.model.commodity.marketsymbol;
        (<any>this.model.commodity).name = this.model.commodity.symbolnameen;

        this.vm = new Vue({
            el: this.getViewModelElement(),
            methods: this.getMethodObjectForVue(),
            data : this.model,
        });
    }

    onNavigationPushed() {
        super.onNavigationPushed();
        this.loadData();
    }

    getContent(content: string) {
        while (true) {
            var regx = /\{([\s\S]+)\}/.exec(content);
            if (regx) {
                var expression = regx[1].replace(/\<br\>/g, "\n");
                console.log(expression);
                var item = this.model.commodity;
                var result = eval(expression);
                content = content.replace(regx[0], result);
            }
            else {
                break;
            }
        }
        return content;
    }

    async loadData() {

        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => this.loadData(), 500);
            return;
        }

        this.model.isBusy = true;
        var originalIsDemo = (<any>HttpClient.defaultHeaders).IsDemo;
        try {
            console.log(`${ApiHelper.ResourceAddress}/rule/${textRes.langName.replace("-", "_")}.htm`);

            
            //删除IsDemo头，否则读取这个网络文件会报错
            delete (<any>HttpClient.defaultHeaders).IsDemo;
            var ret = await HttpClient.sendAsync({
                method: "GET",
                url: `${ApiHelper.ResourceAddress}/rule/${textRes.langName.replace("-", "_")}.htm?t=${new Date().getTime()}`,
            });
           
            var startindex = ret.indexOf("<table");
            var endindex = ret.indexOf("</table");
            ret = ret.substr(startindex, endindex - startindex) + "</table>";
            var div = document.createElement("DIV");
            div.innerHTML = ret;
            var table = <HTMLTableElement>div.children[0];

            for (var i = 0; i < table.rows.length; i++) {
                var row = table.rows[i];
                var title = row.cells[1].innerHTML;
                if (!title)
                    break;
                var content = "";
                try {
                    content = row.cells[2].innerHTML;
                }
                catch (e) { }

                if (content) {
                    content = this.getContent(content);
                   
                    this.model.items.push({
                        title,
                        content
                    });
                    console.log(JSON.stringify(this.model.items[this.model.items.length - 1]));
                }
                else {
                    this.model.tips = this.getContent(title);
                    console.log(this.model.tips);
                }
            }

            var action = () => {
                if (!this.element.querySelector("#tdsample"))
                    setTimeout(action, 100);
                else
                    (<HTMLElement>this.element.querySelector("#tdheader")).style.width = (<HTMLElement>this.element.querySelector("#tdsample")).offsetWidth + 'px';
            };
            setTimeout(action, 100);
        }
        catch (e) {
            alert(JSON.stringify(e));
            showError(e);
        }
        finally {
            this.model.isBusy = false;
            (<any>HttpClient.defaultHeaders).IsDemo = originalIsDemo;
        }
       
    }
}