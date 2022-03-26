
import dotenv from 'dotenv'
dotenv.config()
import express, { response } from 'express'
import { Router } from 'express-serve-static-core'
import axios from "axios";


import { MUTISYS_PARTNER_SECRET, MultisysPayload } from '../../utils/main.interfaces';

import { connection } from '../../configs/database.config';

import { Codes, Message, MultisysCredentials } from '../../utils/main.enums';

import { Endpoints } from '../../utils/main.enums';
/**
 * Multi sys Credentials 
 *  
 *
 *  
*/

const { HTTP_MULTISYS } = Endpoints
const { BILLER, CHANNEL, XMECOM_PARTNER_SECRET } = MultisysCredentials

const secret : MUTISYS_PARTNER_SECRET ={
    SECRET : process.env.X_MECOM_PARTNER_SECRET
}

const calculateJulianDate = async() => {

	let today :any = new Date();
	let onejan:any = new Date(today.getFullYear(),0,1);
	let j :any = Math.ceil((today - onejan) / 86400000);
	let year = today.getFullYear()

	
	switch(String(j).length){
		case 1 : return `${ year }00${ j }`
		
		case 2 : return `${ year }0${ j }`
		
		default: return `${ year }${ j }`
	}
}
const generateMultisysNumbers = async() =>{
	try{
		let series :any
		connection.beginTransaction()
		return await new Promise((resolve, reject)=>{
			connection.query("SELECT * FROM branch_count WHERE type=?", ['IPY'], (err, result)=>{
				if(err) return reject(err)
				resolve(result)
			})
		}).then(async(response : any )=>{
			if(!response.length){
				return 'again'
			}else{
				let count = response[0].count + 1
				series = `${response[0].type}${String(count).padStart(4, '0')}`

				await Promise.resolve(
					connection.query("Update branch_count SET count=? WHERE type=?", [count, 'IPY'], (err, result)=>{
						if(err) throw err
						return result
					})
				)
			
			}
			connection.commit()
			return series
		})
	}catch(err:any){
		connection.rollback()

	}
}

const insertMultisys = async(...data:any) =>{
	try{
		connection.beginTransaction()
		return await new Promise((resolve, reject)=>{

		}).then((response:any)=>{

			connection.commit()
		})

	}catch(err:any){
		connection.rollback()
		return err
	}
}

class MultisysController {
    private router: Router
    constructor() {
        this.router = express.Router()
    }
    watchRequests() {
		
        /***PROCESS IS HERE */

        this.router.post('/inquireMultisys',async (req, res) => {
			
			const { CostumersName, contactNo, account_number, Amount } = req.body

			const payload : MultisysPayload = {
				account_number : account_number,
				amount : Amount,
				contact_number : contactNo,
				biller : BILLER,
				channel : CHANNEL
			}
			try{
				const julianDate = await calculateJulianDate()
				
				const seriesNumber = await generateMultisysNumbers()
				
				await axios.post(`${ HTTP_MULTISYS }/inquire`,payload, {
					/**headers is here */
					headers : {
						accept: "application/json",
						'X-MECOM-PARTNER-SECRET' : XMECOM_PARTNER_SECRET,
						'X-MECOM-PARTNER-REFNO'  : `${ julianDate }${ seriesNumber }`
					}
				}).then((response:any)=>{
					if(response.data.status === 200 && response.data.reason === 'OK'){
						/**insert in database */
						res.status(200).send(response.data.data)
					}else{
						res.status(Codes.SUCCESS).send('again')
					}
				})

			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.response.data.reason)
			}
			
		})

		this.router.post('/proceedTransaction',async (req, res) => {
			
			const { CostumersName, contactNo, account_number, Amount } = req.body

			const payload : MultisysPayload = {
				account_number : account_number,
				amount : Amount,
				contact_number : contactNo,
				biller : BILLER,
				channel : CHANNEL
			}
			
			try{
				const julianDate = await calculateJulianDate()
				
				const seriesNumber = await generateMultisysNumbers()
				
				await axios.post(`${ HTTP_MULTISYS }/process`,payload, {
					/**headers is here */
					headers : {
						accept: "application/json",
						'X-MECOM-PARTNER-SECRET' : XMECOM_PARTNER_SECRET,
						'X-MECOM-PARTNER-REFNO'  : `${ julianDate }${ seriesNumber }`
					}
				}).then((response:any)=>{
					if(response.data.status === 200){
						/**ready to save in database */
						res.status(200).send(response.data)
					}else{
						res.status(Codes.SUCCESS).send('again')
					}
				})

			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.response.data.reason)
			}	
		})

    }
  get routerObject() { return this.router }

}
const multisys = new MultisysController()
multisys.watchRequests()
export default multisys.routerObject
