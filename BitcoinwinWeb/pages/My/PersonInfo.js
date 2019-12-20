var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { BaseComponent } from "../../BaseComponent";
import Vue from "vue";
import { ApiHelper, CertificationStatus } from "../../ServerApis/ApiHelper";
import { ForgetPwd } from "../RegisterLogin/ForgetPwd";
import { SetPayPassword } from "./SetPayPassword";
import { RealName } from "./RealName";
var html = require("./personInfo.html");
var PersonInfo = /** @class */ (function (_super) {
    __extends(PersonInfo, _super);
    function PersonInfo() {
        var _this = _super.call(this, html) || this;
        _this.model = {
            textRes: {},
            phone_number: "",
            certificationstatus: "",
            certificationSuccess: false,
            canCertification: false,
            isBusy: false,
        };
        _this.model.textRes = textRes;
        _this.checkStatus();
        _this.vm = new Vue({
            el: _this.getViewModelElement(),
            data: _this.model,
            methods: _this.getMethodObjectForVue(),
            errorCaptured: function (err, vue, info) {
                alert(JSON.stringify(err));
                return false;
            },
        });
        return _this;
    }
    Object.defineProperty(PersonInfo.prototype, "needLogin", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    PersonInfo.prototype.checkStatus = function () {
        if (ApiHelper.CurrentTokenInfo) {
            this.model.phone_number = ApiHelper.CurrentTokenInfo.phone_number;
            if (ApiHelper.CurrentTokenInfo.certificationstatus == CertificationStatus.CertificationSuccess) {
                this.model.certificationstatus = textRes.items["已认证"];
                this.model.certificationSuccess = true;
            }
            else if (ApiHelper.CurrentTokenInfo.certificationstatus == CertificationStatus.CertificationFail) {
                this.model.certificationstatus = textRes.items["认证失败"];
                this.model.canCertification = true;
            }
            else if (ApiHelper.CurrentTokenInfo.certificationstatus == CertificationStatus.CertificationAuditing) {
                this.model.certificationstatus = textRes.items["审核中..."];
            }
            else if (ApiHelper.CurrentTokenInfo.certificationstatus == CertificationStatus.Uncertified || ApiHelper.CurrentTokenInfo.certificationstatus == undefined) {
                this.model.certificationstatus = textRes.items["未认证"];
                this.model.canCertification = true;
            }
        }
    };
    PersonInfo.prototype.onNavigationActived = function (isresume) {
        _super.prototype.onNavigationActived.call(this, isresume);
        if (isresume) {
            this.checkStatus();
        }
    };
    PersonInfo.prototype.modifyPwdClick = function () {
        navigation.push(new ForgetPwd());
    };
    PersonInfo.prototype.setPayPwdClick = function () {
        navigation.push(new SetPayPassword());
    };
    PersonInfo.prototype.realNameClick = function () {
        if (ApiHelper.CurrentTokenInfo.certificationstatus == undefined ||
            ApiHelper.CurrentTokenInfo.certificationstatus == CertificationStatus.Uncertified || ApiHelper.CurrentTokenInfo.certificationstatus == CertificationStatus.CertificationFail)
            navigation.push(new RealName());
    };
    return PersonInfo;
}(BaseComponent));
export { PersonInfo };
//# sourceMappingURL=PersonInfo.js.map