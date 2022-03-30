export enum Keywords {
    PRODUCTION = 'production',
    DEVELOPMENT = 'development'
}

export enum Message {
    INTERNAL = "Internal Server Error! : Please contact technical team.",
    SUCCESS = "success"
}

export enum Codes {
    INTERNAL = 500,
    SUCCESS = 200,
    UNAUTHORIZED = 401,
    NOTFOUND = 404,
    BADREQUEST = 400
}

export enum Endpoints {
    BARKOTA_STAGING = "https://barkota-reseller-php-staging-4kl27j34za-uc.a.run.app",

    LOADCENTRAL_SELL_PRODUCT = "https://loadcentral.net/sellapi.do",
    LOADCENTRAL_SELL_PRODUCT_STATUS = "https://loadcentral.net/sellapiinq.do",

    HTTP_MULTISYS = 'https://uat-partners2.multipay.ph/api/v3/billers'
}

export enum MultisysCredentials {
    BILLER = 'MULTIPAY',
    CHANNEL = '1A85'
}


