import { TextRes } from "../TextRes";
import { Navigation } from "jack-one-script";

declare global {
    export interface ApiCloudApi {
        /**比如iPhone X的型号： iPhone10,3 */
        deviceModel: string;
        deviceToken: string;
        deviceId: string;
        /**操作系统版本 */
        systemVersion: string;
        appVersion: string;
        /**系统类型 android ios */
        systemType: string;
        /**
         * unknown            //未知
ethernet        //以太网
wifi            //wifi
2g                //2G网络
3g                //3G网络
4g                //4G网络
none            //无网络
         * */
        connectionType: string;
        debug: boolean;
        pageParam: any;
        safeArea: any;
        actionSheet: (p, cb) => void;
        rebootApp: () => void;
        readFile: (p) => any;
        setAppIconBadge: (p) => any;
        writeFile: (p, cb) => void;
        installApp: (p) => void;
        openApp: (p, cb = undefined) => void;
        showProgress: (p) => void;
        download: (p, cb) => void;
        hideProgress: () => void;
        ajax: (p, cb) => void;
        closeWidget: (p) => void;
        require: (p) => any;
        toast: (p) => any;
        setPrefs: (p) => void;
        getPrefs: (p) => any;
        removePrefs: (p) => void;
        addEventListener: (p, cb) => void;
        openFrame: (p) => void;
        closeFrame: (p) => void;
        sendFrameToBack: (p) => void;
        removeLaunchView: () => void;
        setScreenOrientation: (p) => void;
        execScript: (p) => void;
        sendEvent: (p) => void;
        startLocation: (p, cb: (ret, err) => void) => void;
        setStatusBarStyle: (p) => void;
        setKeepScreenOn: (p) => void;
    }
    export interface Window {
        textRes: TextRes;
        api: ApiCloudApi;
        __remConfig_flag: number;
     }
    export var textRes: TextRes;
    export var isIOS: boolean;
    export var toast: (msg: string, seconds: number) => void;
    export var navigation: Navigation;
    export var supportLangObjects: any[];
}

