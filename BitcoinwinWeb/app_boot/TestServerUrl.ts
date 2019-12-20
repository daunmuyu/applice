import { IRunner } from "./IRunner";
import { GlobalDefines } from "./GlobalDefines";

/**检查哪个域名可以使用 */
export class TestServerUrl implements IRunner {
    onSuccessed: IRunner;
    onError: IRunner;

    run(param: any[]): void {
        var done = 0;
        var exit = false;

        for (var i = 0; i < param.length; i++) {
            var item = param[i];

            window.api.ajax({
                url: `${item.packageUrl}/version.txt`,
                method: 'get',
            }, (ret, err)=> {
                done++;
                if (exit)
                    return;

                if (ret) {
                    //这个域名配置可以使用
                    exit = true;

                    console.log("测试通过，使用域名：" + item.packageUrl);

                    GlobalDefines.serverUrl = item.packageUrl;

                    window.api.setPrefs({
                        key: "read_serverurl",
                        value: GlobalDefines.serverUrl
                    });

                    window.api.setPrefs({
                        key: "read_serverurl_config",
                        value: JSON.stringify(item)
                    });

                    if (this.onSuccessed) {
                        this.onSuccessed.run(null);
                    }
                }
                else if (err) {
                    if (!exit && done >= ret.length) {
                        window.setTimeout(() => {
                            this.run(param);
                        }, 500);
                        return;
                    }
                }

            });

        }
    }


}