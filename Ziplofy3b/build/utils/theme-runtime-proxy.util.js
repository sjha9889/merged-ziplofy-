"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catalogRemoteRuntimeProxyPath = catalogRemoteRuntimeProxyPath;
exports.catalogRemoteRuntimeProxyUrls = catalogRemoteRuntimeProxyUrls;
/** Browser-safe paths for catalog theme.js/css via API (avoids S3 CORS from render-store). */
function catalogRemoteRuntimeProxyPath(themeId, asset) {
    return `/api/themes/${encodeURIComponent(themeId)}/remote-runtime/${asset}`;
}
function catalogRemoteRuntimeProxyUrls(themeId, s3) {
    return {
        jsUrl: s3?.reactThemeJs?.key ? catalogRemoteRuntimeProxyPath(themeId, 'theme.js') : null,
        cssUrl: s3?.reactThemeCss?.key ? catalogRemoteRuntimeProxyPath(themeId, 'theme.css') : null,
    };
}
