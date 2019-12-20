export class GlobalDefines {
    //所有静态变量在boot.html中定义值
    static serverUrl = "";

    static serverTestUrl = "";
    static canDebug = false;
    static localmainhtml = "";
    static zipfile = "";
    static versionfile = "";
    /**用户切换到后台，几分钟再回来，需要重新加载app，为0表示不重新加载*/
    static reOpenAppForMinutes = 0;
}

for (var p in GlobalDefines) {
    if (window[p])
        GlobalDefines[p] = window[p];
}

export interface AppVersionInfo {
    /**当前app html 版本号 */
    version: number;
    /**当前app放在哪个文件夹 001 还是 002 */
    folder: string;
}

export interface DownloadAppVersionInfo {
    newinfo: AppVersionInfo;
    oldinfo: AppVersionInfo;
    allowLocalVersion: boolean;
}
