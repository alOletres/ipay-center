import express, { response } from 'express'
import { Router } from 'express-serve-static-core'

import {Md5} from "md5-typescript";

class EloadsController {

    private router: Router
    constructor() {
        this.router = express.Router()
    }
    watchRequests() {

        /**
         * @Functions
         */

       /**
         * Sell Product Request
         *    : https://loadcentral.net/sellapi.do
         *    ?uid=newtest
         *    &auth=3e5d80776b4d520b43adc9ae24aadab1
         *    &pcode=ZTEST1
         *    &to=639180000001
         *    &rrn=ABC5203432373
         * 
         * Sell Product Request Status
         *    : https://loadcentral.net/sellapiinq.do
         *    ?uid=63xxxxxxxxxx
         *    &auth=6cfa21290ed4f9cac5f366aaf2889526
         *    &rrn=ABC5203432373
         * 
         * 
        */

    }
    get routerObject() { return this.router }

}
const eloads = new EloadsController()
eloads.watchRequests()
export default eloads.routerObject