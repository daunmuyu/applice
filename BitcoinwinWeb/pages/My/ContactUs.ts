import { BaseComponent } from "../../BaseComponent";
import { Component } from "jack-one-script";
import Vue from "vue";
import { showError } from "../../Global";
import { TextRes } from "../../TextRes";
import { alertWindow } from "../../GlobalFunc";
var qrcode = require("qrcode");

var html = require("./contactUs.html");
export class ContactUs extends BaseComponent {
    vm: Vue;
    model = {
        textRes: <TextRes>{}
    };
    get needLogin() {
        return false;
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

    async copyEmail() {
        var clipBoard = window.api.require('clipBoard');
        clipBoard.set({
            value: 'service@bitcoinwin.io'
        });
        await alertWindow(textRes.items['成功复制']);
    }

    onNavigationPushed() {
        super.onNavigationPushed();

        var ele = <HTMLElement>this.element.querySelector("#canvgQrcode");
        qrcode.toCanvas(ele,
            "https://u.wechat.com/MCDFYa37aB0RcXFPfhqL7Pk",
            {
                width: ele.offsetWidth,
                height: ele.offsetHeight,
                margin:0,//为0没有白边
            },
            function (error) {
                if (error)
                    showError(error);
            });        
    }

    /**截屏 */
    screenShot() {
        var screenClip = (<any>window).api.require('screenClip');
        screenClip.screenShot({
            album:true
        }, async (ret, err)=> {
            console.log(JSON.stringify({ret:ret,err:err}) );
                if (ret.status) {
                    await alertWindow((<any>window).textRes.items["成功截屏"]);
            } 
        });
    }

    /**保存到相册 */
    save2album() {
        var divqrcode = <HTMLElement>this.element.querySelector("#divqrcode");
        var base64 = (<any>divqrcode.querySelector("IMG")).src;
        base64 = base64.substr(base64.indexOf("base64,") + 7);

        var trans = (<any>window).api.require('trans');
        trans.saveImage({
            base64Str: base64,
            album: true,
        }, async (ret, err)=> {
            if (ret.status) {

            } else {
                await  alertWindow(err.msg);
            }
        });
    }

  
}