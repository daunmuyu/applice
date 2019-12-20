import { IRunner } from "./IRunner";
import { DownloadAppVersionInfo, GlobalDefines, AppVersionInfo } from "./GlobalDefines";

export class DownloadApp implements IRunner {
    onSuccessed: IRunner;
    onError: IRunner;

    run(param: DownloadAppVersionInfo): void {

        //隐藏开机画面
        window.api.removeLaunchView();


        console.log("downloadNewApp 执行");

        if (window.api.require('kLine').download) {
            this.download(param);
        }
        else {
            this.downloadWithApiCloud(param);
        }
    }

    download(param: DownloadAppVersionInfo) {

        console.log("window.api.require('kLine').download");
        var zip = window.api.require('zip');
        if (!zip)
            alert("zip模块未被引用");


        var divPercent = <HTMLElement>document.body.querySelector("#divPercent");
        if (!divPercent)
            alert("页面缺少divPercent");
        var divPercentBg = <HTMLElement>document.body.querySelector("#divPercentBg");
        if (!divPercentBg)
            alert("页面缺少divPercentBg");
        var divBg = <HTMLElement>document.body.querySelector("#divBg");
        if (!divBg)
            alert("页面缺少divBg");

        window.api.require('kLine').download({
            url: GlobalDefines.serverUrl + "/" + GlobalDefines.zipfile + "?t=" + new Date().getTime(),
            savePath: 'fs://app.zip',
        }, (ret, err) => {

            if (err) {
                if (param.oldinfo.version == -1 || !param.allowLocalVersion) {
                    console.log("网络故障，继续downloadNewApp");
                    setTimeout(() => {
                        this.run(param);
                    }, 1000);
                }
                else {
                    console.log("下载失败，继续加载旧版本，" + JSON.stringify(err));
                    if (this.onSuccessed) {
                        this.onSuccessed.run(param.oldinfo);
                    }
                }
            }
            else if (ret.status == 2) {
                divPercent.innerHTML = "100%";
                divBg.style.width = "100%";

                console.log("download completed!");

                zip.unarchive({
                    file: 'fs://app.zip',
                    toPath: "fs://web2/" + param.newinfo.folder + "/"
                }, (ret2, err) => {
                    if (ret2.status) {
                        this.writeVersion(param.newinfo);
                    } else if (err) {
                        alert(JSON.stringify(err));
                    }
                });

            }
            else if (ret.status == 1) {
                divPercent.style.display = "";
                divPercentBg.style.display = "";
                divPercent.innerHTML = "Connecting " + ret.percent + "%";
                divBg.style.width = ret.percent + "%";
            }
        });
    }

    downloadWithApiCloud(param: DownloadAppVersionInfo) {
        console.log("window.api.download");

        var actualDownloading = false;

        var zip = window.api.require('zip');
        if (!zip)
            alert("zip模块未被引用");

        var divPercent = <HTMLElement>document.body.querySelector("#divPercent");
        if (!divPercent)
            alert("页面缺少divPercent");
        var divPercentBg = <HTMLElement>document.body.querySelector("#divPercentBg");
        if (!divPercentBg)
            alert("页面缺少divPercentBg");
        var divBg = <HTMLElement>document.body.querySelector("#divBg");
        if (!divBg)
            alert("页面缺少divBg");

        window.api.download({
            url: GlobalDefines.serverUrl + "/" + GlobalDefines.zipfile + "?t=" + new Date().getTime(),
            savePath: 'fs://app.zip',
            report: true,
            cache: false,
            allowResume: false,
        }, (ret, err) => {

            //console.log("downloadNewApp 结果返回：ret:" + JSON.stringify(ret) + "  err:" + JSON.stringify(err));
            if (ret.state == 1) {
                divPercent.innerHTML = "100%";
                divBg.style.width = "100%";

                zip.unarchive({
                    file: 'fs://app.zip',
                    toPath: "fs://web2/" + param.newinfo.folder + "/"
                }, (ret2, err) => {
                    if (ret2.status) {
                        this.writeVersion(param.newinfo);
                    } else if (err) {
                        if (!actualDownloading) {
                            //不是真正的下载完毕
                            if (param.oldinfo.version == -1 || !param.allowLocalVersion) {
                                console.log("网络故障，继续downloadNewApp");
                                setTimeout(() => {
                                    this.run(param);
                                }, 1000);
                            }
                            else {
                                console.log("下载失败，继续加载旧版本，" + JSON.stringify(err));
                                if (this.onSuccessed) {
                                    this.onSuccessed.run(param.oldinfo);
                                }
                            }
                        }
                        else {
                            alert(JSON.stringify(err));
                        }
                    }
                });

            }
            else if (ret.state != 0) {
                if (param.oldinfo.version == -1 || !param.allowLocalVersion) {
                    console.log("网络故障，继续downloadNewApp");
                    setTimeout(() => {
                        this.run(param);
                    }, 1000);
                }
                else {
                    console.log("下载失败，继续加载旧版本，" + JSON.stringify(err));
                    if (this.onSuccessed) {
                        this.onSuccessed.run(param.oldinfo);
                    }
                }
            }
            else if (ret.state == 0) {
                divPercent.style.display = "";
                divPercentBg.style.display = "";
                divPercent.innerHTML = "Connecting " + ret.percent + "%";
                divBg.style.width = ret.percent + "%";
                actualDownloading = ret.percent > 0;
            }
        });
    }

    writeVersion(versionInfo: AppVersionInfo) {
        window.api.writeFile({
            path: 'fs://web2/version.txt',
            data: JSON.stringify(versionInfo)
        }, (ret, err) => {
            if (ret.status) {
                if (this.onSuccessed) {
                    this.onSuccessed.run(versionInfo);
                }

            } else if (err) {
                alert(err);
            }

        });
    }

}