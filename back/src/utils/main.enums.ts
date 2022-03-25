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

    HTTP_MULTISYS = 'https://uat-partners2.multipay.ph/api/v3/billers/inquire'
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
export enum MultisysCredentials {
    XMECOM_PARTNER_SECRET = 'qWe4a2yc5w3qs6TufOeC009Wdtpky00wlqY9p8hi0n7OF5WJy1mlrUmTLs1MOwSpBqsWSj15gt539ygmbW7g8j97L0MYXo4ouSCNFmwpmQBj4MdWVnPaINam4L3PzD43'
}


