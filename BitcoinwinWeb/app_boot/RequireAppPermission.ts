import { IRunner } from "./IRunner";

/**获取app必要的权限 */
export class RequireAppPermission implements IRunner {
    onSuccessed: IRunner;
    onError: IRunner;

    run(param: any): void {
        console.log("RequireAppPermission begin");

        var isIOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        var language = navigator.language ? navigator.language : (<any>navigator).browserLanguage;
        var alert_desc = "请允许App读写手机内存及访问照片、媒体内容和文件权限，否则无法运行App!";
        var alert_network_desc = "当前app无法访问网络，请按照以下方法进行设置：\r\n设置-->无线局域网-->使用无线局域网与蜂窝移动的应用(在所有Wi-Fi列表之后)-->选择相应应用-->打开权限";
        if (language.indexOf('zh') < 0) {
            alert_desc = 'Please open the software to read and write the memory of mobile phone and access photos, media content and files.';
            alert_network_desc = "Currently app can not access the network, please set it up as follows:\r\n Settings - > WLAN - > Apps Using WLAN & Cellular (after all Wi-Fi lists) - > select the app - > opening permissions";
        }

        if (isIOS) {
            if (this.onSuccessed) {
                this.onSuccessed.run(null);
            }
            return;
        }
        else {
            //android下，小米5用api.requestPermissions虽然能够设置，包括在小米的安全授权里面也看到设置成功，但就是无效，只能自己写模块实现了
            var module = window.api.require('kLine');
            module.requestPermissions({
                permissions: ['android.permission.WRITE_EXTERNAL_STORAGE', 'android.permission.READ_EXTERNAL_STORAGE']
            }, (ret, err)=> {
                    console.log(JSON.stringify([ret, err]));

                var photoitem;
                for (var i = 0; i < ret.result.length; i++) {
                    var m = ret.result[i];
                    if (m.name == "android.permission.WRITE_EXTERNAL_STORAGE") {
                        photoitem = m;
                        break;
                    }
                }

                    console.log("photoitem.granted:" + photoitem.granted);
                    if (photoitem.granted) {
                        console.log("RequireAppPermission onSuccessed");

                    if (this.onSuccessed) {
                        this.onSuccessed.run(null);
                    }
                    return;
                }
                else {
                    alert(alert_desc);
                    window.api.closeWidget({
                        silent: true
                    });
                }
            });
        }
    }

}