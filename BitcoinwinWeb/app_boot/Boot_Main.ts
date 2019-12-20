import { ConfigReader } from "./ConfigReader";
import { RequireAppPermission } from "./RequireAppPermission";
import { Init } from "./Init";
import { LoadFromInternetDirect } from "./LoadFromInternetDirect";
import { OpenAppWeb } from "./OpenAppWeb";
import { CompareServerVersion } from "./CompareServerVersion";
import { LoadFromLocalZip } from "./LoadFromLocalZip";
import { LoadLocalApp } from "./LoadLocalApp";
import { DownloadApp } from "./DownloadApp";
import { TestServerUrl } from "./TestServerUrl";

(<any>window).apiready = function () {
    var init = new Init();
    var requireAppPermission = new RequireAppPermission();
    var configReader = new ConfigReader();
    var testServerUrl = new TestServerUrl();
    var openAppWeb = new OpenAppWeb();
    var loadFromInternetDirect = new LoadFromInternetDirect();
    var compareServerVersion = new CompareServerVersion();
    var loadFromLocalZip = new LoadFromLocalZip();
    var loadApp = new LoadLocalApp();
    var downloadApp = new DownloadApp();

    init.onSuccessed = requireAppPermission;
    requireAppPermission.onSuccessed = configReader;

    configReader.onSuccessed = openAppWeb;
    configReader.onTestServerUrl = testServerUrl;
    testServerUrl.onSuccessed = openAppWeb;

    openAppWeb.onLoadFromInternet = loadFromInternetDirect;
    openAppWeb.onSuccessed = compareServerVersion;
    openAppWeb.onLoadFromLocalZip = loadFromLocalZip;

    loadFromLocalZip.onSuccessed = compareServerVersion;

    compareServerVersion.onLoadApp = loadApp;
    compareServerVersion.onDownloadApp = downloadApp;

    downloadApp.onSuccessed = loadApp;

    init.run(null);
}