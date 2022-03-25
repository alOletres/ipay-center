import express, { response } from 'express'
import { Router } from 'express-serve-static-core'
import axios from "axios";

import { MUTISYS_PARTNER_SECRET } from '../../utils/main.interfaces';
import moment from 'moment';

var JulianDate = require('julian-date');

const calculateJulianDate = async() => {
	
	var today :any = new Date();
	var onejan:any = new Date(today.getFullYear(),0,1);
	const j :any = Math.ceil((today - onejan) / 86400000);

	switch(String(j).length){
		case 1 : return `00${j}`
		
		case 2 : return `0${j}`
		
		default: return j
	}
}
const secret : MUTISYS_PARTNER_SECRET ={
    SECRET : process.env.X_MECOM_PARTNER_SECRET
}
class MultisysController {
    private router: Router
    constructor() {
        this.router = express.Router()
    }
    watchRequests() {
        /***PROCESS IS HERE */

        this.router.post('/inquireMultisys',async (req, res) => {
        
			
			const julianDate = await calculateJulianDate()
			console.log(julianDate);
			
		})

    }
  get routerObject() { return this.router }

}
const multisys = new MultisysController()
multisys.watchRequests()
export default multisys.routerObject
