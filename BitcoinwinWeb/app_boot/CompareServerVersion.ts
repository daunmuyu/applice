import { IRunner } from "./IRunner";
import { AppVersionInfo, GlobalDefines, DownloadAppVersionInfo } from "./GlobalDefines";

/**从服务器获取app版本，并且进行毕竟 
 run应该传入AppVersionInfo对象
 */
export class CompareServerVersion implements IRunner {
    onSuccessed: IRunner;
    onError: IRunner;
    onDownloadApp: IRunner;
    onLoadApp: IRunner;

    run(param: any): void {
        var appVersionInfo = <AppVersionInfo>param;

        var url = GlobalDefines.serverUrl + '/' + GlobalDefines.versionfile + "?t=" + new Date().getTime();
        console.log("getServerVersion:" + url);
        window.api.ajax({
            url: url,
            method: 'get',
            timeout: 5,
            dataType: 'text',
            cache: false
        }, (ret, err)=> {
            console.log("getServerVersion:" + ret);
            if (ret) {

                eval("ret=" + ret);

                var newVersion = ret.currentVersion;
                var allowMinVersion = ret.minVersion;
                if (allowMinVersion == undefined || !allowMinVersion)
                    allowMinVersion = -100;

                var curVersion = appVersionInfo.version;
                var folder = appVersionInfo.folder;


                console.log("my app version:" + curVersion + " folder:" + folder);
                if ((<any>window).parseInt(curVersion) < parseInt(newVersion)) {

                    if (folder === "001")
                        folder = "002";
                    else
                        folder = "001";

                    console.log("下载新版本到：" + folder);

                    if (this.onDownloadApp) {
                        this.onDownloadApp.run(<DownloadAppVersionInfo>{
                            newinfo: <AppVersionInfo>{
                                folder: folder,
                                version: newVersion
                            },
                            oldinfo: appVersionInfo,
                            allowLocalVersion: (<any>window).parseInt(curVersion) >= allowMinVersion
                        });
                    }

                }
                else {

                    console.log("没有新版本");
                    if (this.onLoadApp) {
                        this.onLoadApp.run(appVersionInfo);
                    }
                }

            } else {

                if (appVersionInfo.version == -1) {
                    console.log("网络故障，继续getServerVersion()");
                    window.setTimeout(() => this.run(param), 1000);
                }
                else {
                    console.log("无法获取version.txt，继续加载旧版本");
                    if (this.onLoadApp) {
                        this.onLoadApp.run(appVersionInfo);
                    }
                }
            }
        });
    }


}