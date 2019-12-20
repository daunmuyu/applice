import { IRunner } from "./IRunner";
import { GlobalDefines } from "./GlobalDefines";

/**读取oss的icon.html里面的配置信息
 * */
export class ConfigReader implements IRunner {
    onSuccessed: IRunner;
    onError: IRunner;
    onTestServerUrl: IRunner;

    private _showed_readConfig_err = false;
    run(param): void {
        console.log("ConfigReader begin");

        if (GlobalDefines.serverUrl) {
            console.log("serverUrl被强行定义为：" + GlobalDefines.serverUrl);
            if (this.onSuccessed) {
                this.onSuccessed.run(null);
            }
            return;
        }

        if (window.api.pageParam && window.api.pageParam.serverUrl) {
            //boot.html需要根据pageParam.serverUrl改变自己的serverUrl
            GlobalDefines.serverUrl = window.api.pageParam.serverUrl;
            if (this.onSuccessed) {
                this.onSuccessed.run(null);
            }
            return;
        }

        var model = window.api.require("kLine");
        model.getConfig((ret, err) => {
            console.log(JSON.stringify([ret,err]));
            if (ret) {
                eval("ret=" + ret.content);
                if (Array.isArray(ret)) {
                    console.log("url配置是数组,进行域名测试");

                    if (this.onTestServerUrl) {
                        this.onTestServerUrl.run(ret);
                        return;
                    }
                    else {
                        ret = ret[0];
                    }
                }

                GlobalDefines.serverUrl = ret.packageUrl;

                window.api.setPrefs({
                    key: "read_serverurl",
                    value: GlobalDefines.serverUrl
                });

                window.api.setPrefs({
                    key: "read_serverurl_config",
                    value: JSON.stringify(ret)
                });

                if (this.onSuccessed) {
                    this.onSuccessed.run(null);
                }

            }
            else {

                GlobalDefines.serverUrl = window.api.getPrefs({
                    sync: true,
                    key: "read_serverurl"
                });
                if (GlobalDefines.serverUrl) {
                    if (this.onSuccessed) {
                        this.onSuccessed.run(null);
                    }
                    return;
                }

                if (!this._showed_readConfig_err) {
                    this._showed_readConfig_err = true;

                    window.api.toast({
                        msg: 'Network error',
                        duration: 5000,
                        location: 'bottom'
                    });
                }

                window.setTimeout(() => this.run(param), 1000);
            }
        });
    }
}