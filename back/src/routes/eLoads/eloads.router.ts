import express, { response } from 'express'
import { Router } from 'express-serve-static-core'
import axios from "axios";

import md5 from 'md5'
import { Codes, Endpoints, LoadCentralCredential, Message } from './../../utils/main.enums'
import { connection } from '../../configs/database.config';
import xml2js from 'xml2js'

const { LOADCENTRAL_SELL_PRODUCT, LOADCENTRAL_SELL_PRODUCT_STATUS } = Endpoints

const { LOADCENTRAL_USERNAME_TEST, LOADCENTRAL_PASSWORD_TEST ,LOADCENTRAL_PROD_USERNAME, LOADCENTRAL_PROD_PASSWORD } = LoadCentralCredential

const parseXML = async (xml:any) => {

	const parser = new xml2js.Parser()
	try {
	   const parsedJSON = await parser.parseStringPromise(xml)
	   return parsedJSON
	} catch (err) {
	   throw err
	}

 }


 const pCODE = async (Pcode:any, amount:any) =>{

	try{
		switch(Pcode){

			case 'GMXMAX': return `${ Pcode }${ amount }`;

			case 'SMFLEXI': return `${ Pcode }${ amount }`;
	
			default: return Pcode
			
		}
	}catch(err){
		return err
	}

 }
 const insertLoad = async (data:any)=>{
	 
	try{
		connection.beginTransaction()
		return await new Promise((resolve, reject)=>{
			connection.query("INSERT INTO loadcentral (reference_id, TransId, mobileNo, productCode, amount, markUp, walletBalance, ePIN, tellerCode, createdBy, LC_response) VALUES (?,?,?,?,?,?,?,?,?,?,?)", 
			[data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7], data[8], data[9], data[10]],(err, result)=>{
				if(err) return reject(err)
				resolve(result)
			})
		}).then(()=>{
			connection.commit()
			return 'ok'
			
		})
	}catch(err){
		connection.rollback()
		return err
	}
 }
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

        this.router.post('/sellProduct',async (req, res) => {
            
			const { data, modelType, productName , productPromo, amount, markup, selectedPromoCodes, tellerCode , createdBy} = req.body
			
			const { contactNo } = data
			
			const PCODE = await pCODE( selectedPromoCodes.LCPRODUCTCODE, amount )
			
			try{
				connection.beginTransaction()
				return await new Promise((resolve, reject)=>{
					connection.query("SELECT * FROM branch_count WHERE type=?", ['IPC'], (err,result)=>{
						if(err) return reject(err)
						resolve(result)
					})
				}).then(async(response:any)=>{
					const series = response[0].count + 1
					const rrn = `${ response[0].type }${String(series).padStart(10,"0")}`

					const hashed = md5(md5(rrn) + md5(LOADCENTRAL_PROD_USERNAME + LOADCENTRAL_PROD_PASSWORD ))
				
					if(!response.length){
						res.status(Codes.SUCCESS).send({ message : 'tryAgain' })
					}else{

						
						await Promise.all([
							Promise.resolve(
								connection.query("UPDATE branch_count SET count=? WHERE type=?", [series, 'IPC'], (err,result)=>{
									if(err) throw err
									return result
								})
							), Promise.resolve(

								await axios.post(`${ LOADCENTRAL_SELL_PRODUCT }?uid=${ LOADCENTRAL_PROD_USERNAME }&auth=${ hashed }&pcode=${ PCODE }&to=63${ contactNo }&rrn=${ rrn }` )
								.then(async(result:any) => {
									
									if(!result.data.length){
										res.status(Codes.SUCCESS).send({ message : 'notFound' })
									
									}else{

										/**
										 * save in database
										*/
										const xml = await parseXML(`<data>${ result.data }</data>`)

										const ress = [ xml.data.RRN[0], xml.data.TID[0], contactNo, PCODE, PCODE.match(/(\d+)/)[1], markup, xml.data.BAL[0], xml.data.EPIN[0], tellerCode, createdBy, xml.data.ERR[0] ]	
										
										const respons = await insertLoad(ress)			
										
										res.status(Codes.SUCCESS).send(respons)	

									}
								}).catch((err:any) => {
									res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
									connection.rollback()
								})

							)
						])

					}
					connection.commit()
				})
			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
				connection.rollback()
			}
        })

    }
    get routerObject() { return this.router }

}
const eloads = new EloadsController()
eloads.watchRequests()
export default eloads.routerObject