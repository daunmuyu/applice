import { BaseComponent, StatusBarStyle } from "../../BaseComponent";
import Vue from "vue";
import { AccountApi } from "../../ServerApis/AccountApi";
import { showError } from "../../Global";
import { MessageCenter, MessageType } from "../../MessageCenter";
import { ApiHelper } from "../../ServerApis/ApiHelper";
import { Register } from "./Register";
import { TextRes } from "../../TextRes";
import { ForgetPwd } from "./ForgetPwd";
import { getCache, setCache, removeCache, alertWindow } from "../../GlobalFunc";
import { win32 } from "path";
import { setTimeout } from "timers";
import { debug } from "util";


var html = require("./login.html");
export class Login extends BaseComponent {
    vm: Vue;
    model = {
        textRes: <TextRes>{},
        username: "",
        password: "",
        isIOS:false,
        fingerLogin: false,
        fingerShake: false,
        fingerHasUI:false,
        autologin: true,
        isBusy: false,
        showHead:false,
        mainColor:null,
    };
    callback: (err)=>void;
    get animationOnNavigation() {
        if (getCache("UseFinger") === "1")
            return false;
        return true;
    }
    get needLogin() {
        return false;
    }
    get statusBarStyle() {
        return StatusBarStyle.Dark;
    }

    constructor() {
        super(html);

        if (window.api && getCache("UseFinger") === "1" && getCache("FingerInfo")) {
            var touchID = window.api.require('jackTouchId');
            if (touchID.hasUI) {
                touchID.hasUI((ret, err) => {
                    this.model.fingerHasUI = ret.result;
                    touchID.isValid((ret, err) => {
                        if (ret.status) {
                            this.model.fingerLogin = true;
                            this.goFingerLogin();
                        }
                    });
                });
            }
            else {
                this.model.fingerHasUI = false;
                touchID.isValid((ret, err) => {
                    if (ret.status) {
                        this.model.fingerLogin = true;
                        this.goFingerLogin();
                    }
                });
            }
        }

        this.model.showHead = ApiHelper.IsDemoMode;
        this.model.isIOS = isIOS;
        this.model.textRes = textRes;
        this.model.mainColor = ApiHelper.MainColor;
        this.model.username = getCache("username");
        this.vm = new Vue({
            el: this.getViewModelElement(),
            data: this.model,
            methods: this.getMethodObjectForVue(),
        });

        
    }

    showIcon() {
        if (!this.model.showHead)
            return;
        var src: string = getCache("myhead");
        if (src) {
            var canEle: HTMLCanvasElement = <HTMLCanvasElement>this.element.querySelector("#icon");

            canEle.width = canEle.offsetWidth;
            canEle.height = canEle.offsetHeight;
            var img = new Image();
            img.onload = () => {
                var ctx = canEle.getContext("2d");
                ctx.clearRect(0, 0, canEle.width, canEle.height);
                ctx.drawImage(img, 0, 0, canEle.width, canEle.height);
            }
            img.src = src;
        }
    }

    photoChange(e: Event) {
        var input = <HTMLInputElement>e.target;
        var canEle: HTMLCanvasElement = <HTMLCanvasElement>this.element.querySelector("#icon");

        canEle.width = canEle.offsetWidth;
        canEle.height = canEle.offsetHeight;

        var reader = new FileReader();
        reader.onload = (e) => {
            var img = new Image();
            img.onload = () => {
                var ctx = canEle.getContext("2d");
                ctx.clearRect(0, 0, canEle.width, canEle.height);
                ctx.drawImage(img, 0, 0, canEle.width, canEle.height);
            }
            setCache("myhead", reader.result);
            img.src = <string>reader.result;

        };
        reader.readAsDataURL(input.files[0]);
    }
    onNavigationPushed() {
        super.onNavigationPushed();
        this.showIcon();
    }
    cancelFinger() {
        var touchID = window.api.require('jackTouchId');
        if (touchID.cancel)
            touchID.cancel();
        navigation.pop();
    }

    enterPassword() {
        var touchID = window.api.require('jackTouchId');
        if (touchID.cancel)
            touchID.cancel();
        this.model.fingerLogin = false;
    }

    goFingerLogin() {
        var touchID = window.api.require('jackTouchId');
        touchID.verify({
            title: textRes.items['指纹验证'],
            usePasswordDesc: textRes.items['输入密码']
        }, async (ret) => {

                if (ret.status) {
                    //如果有回调，那么，直接返回
                    if (this.callback) {
                        navigation.pop(false);
                        this.callback(false);
                        return;
                    }

                    try {
                        this.model.isBusy = true;
                        await AccountApi.RefreshTokenByToken(getCache("FingerInfo"), false);
                        navigation.pop();
                    }
                    catch (e) {
                        if (e.code && e.code == 402) {
                            setCache("FingerInfo", "");
                            this.model.fingerLogin = false;
                        }
                        else {
                            navigation.pop();
                            showError(e);
                        }
                    }
                    finally {
                        this.model.isBusy = false;
                    }

            } else {
                if (ret.code == 0) {
                    //await alertWindow(textRes.items['用户选择手动输入']);
                    //如果有回调，那么，直接返回
                    if (this.callback) {
                        navigation.pop(false);
                        this.callback(true);
                        return;
                    }

                    this.model.fingerLogin = false;
                } else if (ret.code == 1) {
                    //用户取消验证

                    //如果有回调，那么，直接返回
                    if (this.callback) {
                        navigation.pop(false);
                        this.callback(true);
                        return;
                    }

                    navigation.pop();
                } else if (ret.code == 2) {
                    //api.alert({ msg: "验证三次失败" });
                    await alertWindow(textRes.items['指纹验证失败']);

                    //如果有回调，那么，直接返回
                    if (this.callback) {
                        navigation.pop(false);
                        this.callback(true);
                        return;
                    }

                    navigation.pop();
                } else if (ret.code == 3) {
                    //api.alert({ msg: "多次验证失败请锁定手机" });

                    //如果有回调，那么，直接返回
                    if (this.callback) {
                        navigation.pop(false);
                        this.callback(true);
                        return;
                    }

                    await alertWindow(textRes.items['指纹多次验证失败，app将退出']);
                    window.api.closeWidget({
                        silent: true
                    });
                } else if (ret.code == 6) {
                    //指纹验证失败，但仍然可以继续尝试

                    this.model.fingerShake = true;
                    setTimeout(() => { this.model.fingerShake = false; }, 1000);
                } else {
                    await alertWindow(textRes.items['指纹验证失败']);

                    //如果有回调，那么，直接返回
                    if (this.callback) {
                        navigation.pop(false);
                        this.callback(true);
                        return;
                    }

                    navigation.pop();
                }
            }
        });

       
    }

    register() {
        this.recordAction("Login_去注册按钮");

        var page = new Register();
        navigation.push(page);
    }
    forgetPwd() {
        navigation.push(new ForgetPwd());
    }
    async login() {
        if (this.model.isBusy)
            return;

        if (this.model.password.length < 8 || this.model.password.length > 16
            || /[0-9]/.test(this.model.password) === false
            || /[a-zA-Z]/.test(this.model.password) === false) {
            await alertWindow(textRes.items['请输入m密码']);
            return;
        }

        this.recordAction("Login_提交按钮");
        
        this.model.isBusy = true;
        try {
            await AccountApi.Login(this, this.model.username, this.model.password, this.model.autologin);

            setCache("username", this.model.username);
            if (this.model.autologin) {
                setCache("CurrentTokenInfo", JSON.stringify(ApiHelper.CurrentTokenInfo));
            }
            else {
                removeCache("CurrentTokenInfo");
            }
            setCache("CurrentTokenInfo2", JSON.stringify(ApiHelper.CurrentTokenInfo));
            navigation.pop();
        }
        catch (e) {
          
            showError(e , false);
        }
        finally {
            this.model.isBusy = false;
        }
    }
}