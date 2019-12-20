import { IRunner } from "./IRunner";
import { GlobalDefines } from "./GlobalDefines";

/**直接从服务器打开html文件，不从本地app打开 */
export class LoadFromInternetDirect implements IRunner {
    onSuccessed: IRunner;
    onError: IRunner;

    run(param: any): void {
        window.api.openFrame({
            name: 'main',
            url: GlobalDefines.serverTestUrl + '/' + (new Date()).getTime() + '/' + GlobalDefines.localmainhtml,
            rect: {
                x: 0,
                y: 0,
                w: "auto",
                h: "auto"
            },
            bounces: false,
            allowEdit: true,
            useWKWebView: true,
            //customRefreshHeader: 'UIPullRefreshMotive',
            bgColor: 'rgba(0,0,0,0)',
            vScrollBarEnabled: true,
            hScrollBarEnabled: true,
            pageParam: {
                serverUrl: GlobalDefines.serverUrl,
                EncryptKey: "STTuU02NmZi9Ce1E76iWXdgE",
            },
        });

    }


}