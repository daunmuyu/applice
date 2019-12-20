import { IRunner } from "./IRunner";
import { AppVersionInfo } from "./GlobalDefines";

/**从app包里自带的zip文件，解压出程序 如果onSuccessed，将传出AppVersionInfo参数 */
export class LoadFromLocalZip implements IRunner {
    onSuccessed: IRunner;
    onError: IRunner;

    run(param: any): void {
        var localversion = window.api.readFile({
            path: 'widget://wgt/version.txt',
            sync: true
        });

        if (localversion) {

            eval("localversion=" + localversion);
            var versionFileContent = <AppVersionInfo>{
                version: localversion.currentVersion,
                folder: "001"
            };

            var zip = window.api.require('zip');
            if (!zip)
                alert("zip模块未被引用");

            zip.unarchive({
                file: 'widget://wgt/dist.zip',
                toPath: "fs://web2/001/"
            }, (ret2, err)=> {
                if (err)
                    alert(JSON.stringify(err));
                else {
                    if (this.onSuccessed)
                        this.onSuccessed.run(versionFileContent);
                }
            });
        }
        else {
            if (this.onSuccessed) {
                this.onSuccessed.run({
                    version: -1,
                    folder: "002"
                });
            }               
        }
    }


}