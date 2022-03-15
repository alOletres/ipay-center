"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.barkotaCredential = exports.staticPassword = exports.Endpoints = exports.Codes = exports.Message = exports.Keywords = void 0;
var Keywords;
(function (Keywords) {
    Keywords["PRODUCTION"] = "production";
    Keywords["DEVELOPMENT"] = "development";
})(Keywords = exports.Keywords || (exports.Keywords = {}));
var Message;
(function (Message) {
    Message["INTERNAL"] = "Internal Server Error! : Please contact technical team.";
    Message["SUCCESS"] = "success";
})(Message = exports.Message || (exports.Message = {}));
var Codes;
(function (Codes) {
    Codes[Codes["INTERNAL"] = 500] = "INTERNAL";
    Codes[Codes["SUCCESS"] = 200] = "SUCCESS";
    Codes[Codes["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    Codes[Codes["NOTFOUND"] = 404] = "NOTFOUND";
    Codes[Codes["BADREQUEST"] = 400] = "BADREQUEST";
})(Codes = exports.Codes || (exports.Codes = {}));
var Endpoints;
(function (Endpoints) {
    Endpoints["BARKOTA_STAGING"] = "https://barkota-reseller-php-staging-4kl27j34za-uc.a.run.app";
})(Endpoints = exports.Endpoints || (exports.Endpoints = {}));
var staticPassword;
(function (staticPassword) {
    staticPassword["PASSWORD"] = "ipay123456";
    staticPassword[staticPassword["SALTROUNDS"] = 10] = "SALTROUNDS";
})(staticPassword = exports.staticPassword || (exports.staticPassword = {}));
var barkotaCredential;
(function (barkotaCredential) {
    barkotaCredential["username"] = "btr_IPAYCENTER";
    barkotaCredential["password"] = "BTR1641445726807YIIP";
})(barkotaCredential = exports.barkotaCredential || (exports.barkotaCredential = {}));
//# sourceMappingURL=main.enums.js.map