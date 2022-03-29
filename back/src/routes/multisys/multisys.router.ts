
import dotenv, { parse } from 'dotenv'
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

let multisysSecret :any = secret

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
		return err
	}
}

const multisysApi = async(customerName:any, payload:any, BRANCHCODE:any, TELLERCODE:any, CURRENT_WALLET:any) =>{
	try{
		var results :any
		
		const julianDate = await calculateJulianDate()
		const seriesNumber = await generateMultisysNumbers()

		await axios.post(`${ HTTP_MULTISYS }/process`,payload, {
			/**headers is here */
			headers : {
				accept: "application/json",
				'X-MECOM-PARTNER-SECRET' : XMECOM_PARTNER_SECRET,
				'X-MECOM-PARTNER-REFNO'  : `${ julianDate }${ seriesNumber }`
			}
		}).then(async(response:any)=>{
			
			results = await insertMultisys(customerName, payload, response.data, BRANCHCODE, TELLERCODE, `${ julianDate }${ seriesNumber }`, CURRENT_WALLET)
		})
		return results
			

	}catch(err:any){
		return err.response.data
	}	
}
const insertMultisys = async(...data:any) =>{
	
	/**
	 * payment charge 
	 * system fee = 10
	 * outlet fee = 15
	 * ibarangay 10
	 * franchise return 5
	 */
	let systemfee = 10
	const outletCharge =  data[4].slice(0,3) === 'FRT' ? 15
				 		: data[4].slice(0,3) === 'BRT' ? 10 
				 		: ''
	let collection :any = data[1].amount + outletCharge + systemfee /**total colletion */
	let sales :any = data[1].amount + systemfee /** deduct your wallet */
	
	let updatedWallet :any = data[6] - sales
	/**
	 * income === outletCharge
	 */
	try{
		connection.beginTransaction()
		return await new Promise((resolve, reject)=>{

			connection.query("INSERT INTO multisys (partner_refNo, branchCode, tellerCode, customer_name, account_number, amount, contact_number, channel, refno, txnid, biller, collections, sales, income ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
			[data[5], data[3], data[4], data[0], data[1].account_number, data[1].amount, data[1].contact_number, data[1].channel, data[2].data.refno, data[2].data.txnid, data[2].data.biller, collection, sales, outletCharge ], (err, result)=>{
				if(err) return reject(err)
				resolve(result)
			})
		}).then(async(response:any)=>{
			
			/**
			 * table affected wallet update wallet	
			 * wallet transacions
			 */
			if(response.affectedRows !== 1){
				const data = { status : 400, reason : 'Try Again' }
				return data
			}else{
				await Promise.all([
					Promise.resolve(
						connection.query("UPDATE wallet SET current_wallet=? WHERE branchCode=?", [updatedWallet, data[3] ], (err, result)=>{
							if(err) throw err
							return result
						})
					),
					Promise.resolve(
						connection.query("INSERT INTO wallet_historytransaction (branchCode, tellerCode, collection, sales, income, transaction_id, status) VALUES (?,?,?,?,?,?,?) ",
						[data[3], data[4], collection, sales, outletCharge, data[5], 'Confirm' ], (err, result)=>{
							if(err) throw err
							return result
						})
					),
					Promise.resolve(
						/**ibarangay  teller */
						data[4].slice(0,3) === 'BRT' ? await commision(data) 
						:''
					)
				])
				
			}
			connection.commit()
			return data[2]
		})

	}catch(err:any){
		connection.rollback()
		return err
	}
}
const commision = async(data:any)=>{
	
	let systemfee = 10
	let franchiseReturn = 5

	const outletCharge =  data[4].slice(0,3) === 'FRT' ? 15
				 		: data[4].slice(0,3) === 'BRT' ? 10 
				 		: ''
	let collection :any = data[1].amount + outletCharge + systemfee /**total colletion */
	let sales :any = data[1].amount + systemfee /** deduct your wallet */
	
	
	try{
		connection.beginTransaction()
		return await new Promise((resolve, reject)=>{
			/**select ibrgy table to get the franchise code */
			connection.query("SELECT ib_fbranchCode FROM ibrgy_list WHERE ib_ibrgyyCode=?", [ data[3] ], (err, result)=>{
				if (err) return reject(err)
				resolve(result)
			})
		}).then(async(response:any)=>{

			await Promise.resolve(
				connection.query("INSERT INTO f_commission (franchise, ibarangay, teller, collection, sales, income, transaction_id, status) VALUES (?,?,?,?,?,?,?,?) ",
				[response[0].ib_fbranchCode, data[3], data[4], collection, sales, franchiseReturn, data[5], 'Confirm' ], (err, result)=>{
					if(err) throw err
					return result
				})
			)
			connection.commit()
		})
	}catch(err:any){
		connection.rollback()
		return err
	}
}
const checkWallet = async (branchCode:any)=>{
	try{
		
		connection.beginTransaction()
		return await new Promise((resolve ,reject)=>{
			connection.query("SELECT * FROM wallet WHERE branchCode=?", [branchCode], (err, result)=>{
				if(err) return reject(err)
				resolve(result)
			})
		}).then((response:any)=>{
			connection.commit()
			
			return response
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
			
			const { data, amount, tellerCode } = req.body

			const payload : MultisysPayload = {
				account_number : data.account_number,
				amount : amount,
				contact_number : data.contactNo,
				biller : BILLER,
				channel : CHANNEL
			}
			try{
				connection.beginTransaction()
				return await new Promise((resolve, reject)=>{

					connection.query("SELECT * FROM teller_list WHERE tellerCode=?", [tellerCode], (err, result)=>{
						if(err) return reject(err)
						resolve(result)
					})
					
				}).then(async (response:any)=>{
					
					if(!response.length){
						res.status(Codes.SUCCESS).send({ message : 'notfound' })
					}else{
						/**
						 * check wallet of branch 
						 */
						if(tellerCode.slice(0,3) === 'FRT'){

							const result :any = await checkWallet(response[0].fiB_Code)
							
							if(result[0].current_wallet === 5000 || result[0].current_wallet < 5000){

								res.status(Codes.SUCCESS).send({ message : 'low_wallet' })
								
								
							}else{
								/**
								 * proceed to insert
								 */
								const results = await multisysApi(data.CostumersName, payload, response[0].fiB_Code, tellerCode, result[0].current_wallet)
								console.log(results);
								
								res.status(Codes.SUCCESS).send(results)
							
							}
							
						}else{
							const result = await checkWallet(response[0].ibrgy_code)
							
							if(result[0].current_wallet === 5000 || result[0].current_wallet < 5000){
							
								res.status(Codes.SUCCESS).send({ message : 'low_wallet' })

							}else{
								/**
								 * proceed to insert
								 */
								// const resss = await LoadCentralApi(req.body, response[0].ibrgy_code, result[0].current_wallet)
							
								// res.status(Codes.SUCCESS).send({ message : resss })
								const results = await multisysApi(data.CostumersName, payload, response[0].ibrgy_code, tellerCode, result[0].current_wallet)
								
								res.status(Codes.SUCCESS).send(results)
							}
							
						}
					}
					connection.commit()
					
				})
				
			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
				connection.rollback()
			}
			
		})

		this.router.get('/getMultisysTransaction',async (req, res) => {
			try{
				connection.query("SELECT * FROM multisys", (err, result)=>{
					if(err) throw err
					res.status(Codes.SUCCESS).send(result)
				})

			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}			
		})
    } /**end of wacth function */
  get routerObject() { return this.router }

}
const multisys = new MultisysController()
multisys.watchRequests()
export default multisys.routerObject
