import { IRunner } from "./IRunner";
import { GlobalDefines } from "./GlobalDefines";

/**准备加载app，如果onSuccessed，将传出AppVersionInfo参数 */
export class OpenAppWeb implements IRunner {
    onSuccessed: IRunner;
    onError: IRunner;
    onLoadFromInternet: IRunner;
    onLoadFromLocalZip: IRunner;

    run(param: any): void {
        if (GlobalDefines.canDebug && window.api.debug) {
            window.api.setKeepScreenOn({
                keepOn: true
            });


            if (this.onLoadFromInternet)
                this.onLoadFromInternet.run(null);
            return;
        }


        var versionFileContent = window.api.readFile({
            path: 'fs://web2/version.txt',
            sync: true
        });

        if (versionFileContent) {
            eval("versionFileContent=" + versionFileContent);
            if (this.onSuccessed)
                this.onSuccessed.run(versionFileContent);
        }
        else {
            if (this.onLoadFromLocalZip)
                this.onLoadFromLocalZip.run(null);
        }
    }


}