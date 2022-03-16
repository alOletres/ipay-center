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
    LOADCENTRAL_SELL_PRODUCT_STATUS = "https://loadcentral.net/sellapiinq.do"
}

export enum staticPassword {
    PASSWORD = "ipay123456",
    SALTROUNDS = 10
}

export enum barkotaCredential {
    username = "btr_IPAYCENTER",
    password = "BTR1641445726807YIIP"
}
export enum LoadCentralCredential {
    LOADCENTRAL_USERNAME_TEST = 'masterpay_test',
    LOADCENTRAL_PASSWORD_TEST = '123456',
    LOADCENTRAL_PROD_USERNAME =  'masterpayavenue2016',
    LOADCENTRAL_PROD_PASSWORD =  '7654321'
}


