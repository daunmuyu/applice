import { IRunner } from "./IRunner";
import { AppVersionInfo, GlobalDefines } from "./GlobalDefines";


export class LoadLocalApp implements IRunner {
    onSuccessed: IRunner;
    onError: IRunner;

    run(param: AppVersionInfo): void {

        window.api.openFrame({
            name: 'main',
            url: 'fs://web2/' + param.folder + '/' + GlobalDefines.localmainhtml,
            rect: {
                x: 0,
                y: 0,
                w: "auto",
                h: "auto"
            },
            allowEdit: true,
            bounces: false,
            useWKWebView: true,
            //customRefreshHeader: 'UIPullRefreshMotive',
            bgColor: 'rgba(0,0,0,0)',
            vScrollBarEnabled: false,
            hScrollBarEnabled: false,
            pageParam: {
                serverUrl: GlobalDefines.serverUrl,
                EncryptKey: "STTuU02NmZi9Ce1E76iWXdgE",
                folder: param.folder,
            },
        });
        //让底板变成全白
        document.body.innerHTML = "";
    }

  
}