import { json } from 'body-parser'
import express, { response } from 'express'
import { Router } from 'express-serve-static-core'
import moment from 'moment'

import { connection } from '../../configs/database.config'
import { Message, Codes } from '../../utils/main.enums'

class WalletsController {
    private router: Router
    constructor() {
        this.router = express.Router()
    }
    watchRequests() {
        /**
         * @Functions
         */

        this.router.post('/topupload',async (req, res) => {
            const { data, img, remarks} = req.body
			
            try{
				if(remarks === '' || remarks === null || remarks === undefined){

					connection.beginTransaction()

					await new Promise((resolve,reject)=>{
						connection.query('INSERT INTO top_uploads (branchCode, fbranchCode, image, referenceNumber, payment_date, payment_status, amount) VALUES (?, ?, ?, ?, ?, ?, ?)',
						[data.bcode, data.fcode, img, data.reference, data.date_trans, 0, data.credit], (err, result)=>{
							if(err) return reject(err)
							resolve(result) 
						})
					}).then((response:any)=>{
						if(!response.length){
							res.status(Codes.SUCCESS).send( { message : 'again'} )
							connection.commit()
						}else{
							res.status(Codes.SUCCESS).send( { message : 'ok'} )
							connection.commit()
						}
						
					})
					
				}else{
					connection.beginTransaction()
					await new Promise((resolve, reject)=>{
						connection.query('INSERT INTO top_uploads (branchCode, fbranchCode, image, referenceNumber, payment_date, payment_status, amount, remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
						[data.bcode, data.fcode, img, data.reference,  data.date_trans, 0, data.credit, remarks ], (err, result)=>{
							if(err) return reject(err);
							resolve(result)
						})
					}).then((response:any)=>{
						if(!response.length){
							res.status(Codes.SUCCESS).send( { message : 'again'} )
							connection.commit()
						}else{
							res.status(Codes.SUCCESS).send( { message : 'ok'} )
							connection.commit()
						}
						
					})
					
				}
				
			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
				connection.rollback()
			}
        })

		this.router.post('/getTopup_list',async (req, res) => {
			const { code } = req.body
			try{
				connection.query('SELECT * FROM top_uploads WHERE fbranchCode=?', [code], (err, result)=>{
					if(err) throw err;
					res.status(Codes.SUCCESS).send(result)
				})
			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}			
		})
		this.router.post('/getTopup_listForBranchHead',async (req, res) => {
			const { code } = req.body
			try{
				connection.query('SELECT * FROM top_uploads WHERE branchCode=? AND payment_status=?', [code, 0], (err, result)=>{
					if(err) throw err;
					res.status(Codes.SUCCESS).send(result)
				})
			}catch(err : any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
		})

		this.router.post('/approvedTopupLoad',async (req, res) => {
			const { approved_date, approved_by, id, data, fcode } = req.body	
			try{
				connection.beginTransaction()
				return new Promise((resolve, reject)=>{
					// select for top uploads table if theres any data
					connection.query("SELECT * FROM wallet WHERE branchCode=? ", [fcode],(err, result)=>{
						
						if(err) throw err;
						resolve(result)

					})
				}).then(async (response :any) => {
					// total values from wallet table to top upload 
					const total_approvedWallet = response[0].approved_wallet + data.credit
					const total_currentWallet = response[0].current_wallet + data.credit
					
					await Promise.all([
						Promise.resolve(
							// update current wallet to wallet table
							connection.query("UPDATE wallet SET approved_wallet=?, current_wallet=? WHERE branchCode=?", 
							[total_approvedWallet, total_currentWallet, fcode],(err, result)=>{
								if(err) throw err;
								return result
							})
						), Promise.resolve(
							// update top uploads wallet has been approved 
							connection.query('UPDATE top_uploads SET payment_status=?, approved_by=?, approved_date=? WHERE id=?',
							[1, approved_by, approved_date, id],(err, result)=>{
								if(err) throw err;
								return result
							})
						)
					])

					connection.commit()
					res.status(Codes.SUCCESS).send(`Added.`)
					
				})
				.catch((err) => {
                    connection.rollback()
                    res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
                })
				
			}catch(err:any){
				connection.rollback()
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
		})

		this.router.post('/sendLoadtable',async (req, res) => {
			const { data, fbranchCode, available_wallet } = req.body
			const dateNow = new Date()
			if(available_wallet < data.credit){

				res.status(Codes.SUCCESS).send('dli')

			}else{

				// 
				try{
					connection.beginTransaction()
					return new Promise((resolve, reject)=>{
						// insert the load in sendload table
						connection.query("SELECT * FROM wallet WHERE branchCode=?", [data.ib_code],(err, result)=>{
							if(err) throw err;
							resolve(result)
						})

					}).then(async(response:any) =>{
						// plus the ibarangay wallet load afterwards minus the franchise wallet
						const totalapproved = data.credit + response[0].approved_wallet
						const totalcurrent_wallet = data.credit + response[0].current_wallet 
						
						// 2nd query
						connection.beginTransaction()
						return new Promise((resolve, reject)=>{
							connection.query("SELECT * FROM wallet WHERE branchCode=?", [fbranchCode],(err, result)=>{
								if(err) throw err;
								resolve(result)
							})
						}).then(async (response:any) => {
							// mag minus ko dri para makuhaan ang wallet ni franchise
							const decCurrent_wallet = response[0].current_wallet - data.credit

							await Promise.all([
								Promise.resolve(
									// update wallet for ibarangay approved and current wallet
									connection.query("UPDATE wallet SET approved_wallet=?, current_wallet=? WHERE branchCode=?",
									[totalapproved, totalcurrent_wallet, data.ib_code], (err, result)=>{
										if(err) throw err;
										return result
									})
								),Promise.resolve(
									// update wallet in franchise current wallet
									connection.query("UPDATE wallet SET current_wallet=? WHERE branchCode=?",
									[decCurrent_wallet, fbranchCode], (err, result)=>{
										if(err) throw err;
										return result
									})
								),Promise.resolve(
									// insert data to send load list
									connection.query("INSERT INTO sendload_list (fbranchCode, ibrgy_code, credit_sent, load_status, paid_date) VALUES (?, ?, ?, ?, ?)",
									[fbranchCode, data.ib_code, data.credit, data.paymentStatus, dateNow], (err, result)=>{
										if(err) throw err;
										return result
									})
								)
							])
							connection.commit()
							res.status(Codes.SUCCESS).send(`${ Message.SUCCESS } Added.`)

						}).catch((err) => {
							connection.rollback()
							res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
						})

						// last block of catch
					}).catch((err) => {
						connection.rollback()
						res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
					})

				}catch( err : any ) {
					connection.rollback()
					res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
				}	
			}
				
		})

		this.router.post('/getFranchisewallet',async (req, res) => {
			const { fbranchCode } = req.body
			try{
				connection.query("SELECT * FROM wallet WHERE branchCode=?", [fbranchCode], (err, result)=>{
					if(err) throw err;
					res.status(Codes.SUCCESS).send(result)
				})
			}catch( err: any ){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
		})

		this.router.post('/updateLoadstatus',async (req, res) => {

			const { paymentStatus, id } = req.body
			const dateNow = new Date();
			
			try{
				connection.query("UPDATE sendload_list SET load_status=?, paid_date=? WHERE id=?", [paymentStatus, dateNow, id], (err, result)=>{
					if(err) throw err;
					res.status(Codes.SUCCESS).send(result)
				})
			}catch(err : any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
		})

		this.router.post('/checkAvailableWallet', async (req, res) => {
			const { branchCode } = req.body
			try{
				connection.beginTransaction()
				 return await new Promise((resolve, reject)=>{
					connection.query("SELECT * FROM teller_list WHERE tellerCode=?", [branchCode], (err, result)=>{
						if(err) throw err;
						resolve(result)
					})
				}).then(async(response:any)=>{
					
					if(response[0].fiB_Code !== '' && response[0].ibrgy_code !== ''){
						await Promise.resolve(
							connection.query("SELECT * FROM wallet WHERE branchCode=?", [response[0].ibrgy_code], (err,result)=>{
								if(err)throw err;
								connection.commit()
								res.status(Codes.SUCCESS).send(JSON.stringify(result))
							})
						)
					}else if(response[0].fiB_Code !== '' && response[0].ibrgy_code === ''){
						await Promise.resolve(
							connection.query("SELECT * FROM wallet WHERE branchCode=?", [response[0].fiB_Code], (err,result)=>{
								if(err)throw err;
								connection.commit()
								res.status(Codes.SUCCESS).send(JSON.stringify(result))
							})
						)
					}else if (response[0].fiB_Code === '' && response[0].ibrgy_code !== ''){
						await Promise.resolve(
							connection.query("SELECT * FROM wallet WHERE branchCode=?", [response[0].ibrgy_code], (err,result)=>{
								if(err)throw err;
								connection.commit()
								res.status(Codes.SUCCESS).send(JSON.stringify(result))
							})
						)
					}		
					
				}).catch((err:any)=>{
					res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
				})
			}catch(err:any){
				connection.rollback()
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
		})

		this.router.get('/adminTopUpload',async (req, res) => {
			try{

				await Promise.resolve(
					connection.query("SELECT * FROM top_uploads WHERE payment_status=?",[0], (err, result)=>{
						if(err) throw err;
						res.status(Codes.SUCCESS).send(JSON.stringify(result))
					})
				)
			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}		
		})

		this.router.post('/walletHistory',async (req, res) => {
			
			const { code } = req.body
			
			try{
				await Promise.resolve(
					connection.query("SELECT * FROM wallet_historytransaction INNER JOIN barkota ON wallet_historytransaction.transaction_id = barkota.barkota_code WHERE wallet_historytransaction.branchCode=? AND barkota.branchCode=?", [code, code], (err, result)=>{
						if(err) throw err;
						res.status(Codes.SUCCESS).send(result)
					})
				)
			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
						
		})

		this.router.post('/checkFranchiseWallet',async (req, res) => {
			const { code } = req.body
			try{
				await Promise.resolve(
					connection.query("SELECT * FROM wallet WHERE branchCode=?", [code], (err, result)=>{
						if(err) throw err;
						res.status(Codes.SUCCESS).send(JSON.stringify(result))
					})
				)
			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
		})

		this.router.get('/walletTransactionForAdminBranchHead',async (req, res) => {
		
			try{
				await Promise.resolve(
					connection.query("SELECT * FROM wallet_historytransaction INNER JOIN barkota ON wallet_historytransaction.transaction_id = barkota.barkota_code", 
					(err, result)=>{
						if(err) throw err;
						res.status(Codes.SUCCESS).send(JSON.stringify(result))
					})
				)
			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
						
		})
		this.router.get('/walletBranchesMonitoring',async (req, res) => {

			try{
				await Promise.resolve(
					connection.query("SELECT * FROM wallet INNER JOIN franchise_list ON wallet.branchCode = franchise_list.fbranchCode", (err, result)=>{
						if(err) throw err
						res.status(Codes.SUCCESS).send(JSON.stringify(result))
					})
				)
			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
		})


		this.router.get('/walletiBarangayMonitoring',async (req, res) => {
			try{
				await Promise.resolve(
					connection.query("SELECT * FROM wallet INNER JOIN ibrgy_list ON wallet.branchCode = ibrgy_list.ib_ibrgyyCode", (err, result)=>{
						if(err) throw err;
						res.status(Codes.SUCCESS).send(JSON.stringify(result))
					})
				)
			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}		
		})

		this.router.get('/topUploadsFranchiseeHistory',async (req, res) => {
			try{
				await Promise.resolve(
					connection.query("SELECT * FROM top_uploads INNER JOIN franchise_list ON top_uploads.fbranchCode = franchise_list.fbranchCode", (err, result)=>{
						if(err) throw err;
						res.status(Codes.SUCCESS).send(JSON.stringify(result))
					})
				)
			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
		})

		this.router.get('/topUploadsIbarangayHistory',async (req, res) => {
			try{
				await Promise.resolve(
					connection.query("SELECT * FROM top_uploads INNER JOIN ibrgy_list ON top_uploads.fbranchCode = ibrgy_list.ib_ibrgyyCode", (err, result)=>{
						if(err) throw err;
						res.status(Codes.SUCCESS).send(JSON.stringify(result))
					})
				)
			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}			
		})
	}
	/**
	*@endOfWatchList
	*/
    get routerObject() { return this.router }
}


const user = new WalletsController()

user.watchRequests()
export default user.routerObject
function resolve(result: any) {
	throw new Error('Function not implemented.')
}

