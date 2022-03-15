import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import { Express } from 'express-serve-static-core'
import cors from 'cors'
import http from 'http'
import https from 'https'
import * as fs from 'fs';
import MainModule from './module.main'
import { Keywords } from './utils/main.enums'
import  { socket } from './socket/socket.server'
import  { watch }  from './databaseWatcher/db_watcher.server'
import { Server } from 'socket.io'

const startSocketServer = (instance:any) => socket( {instance} )
class MainServer {
	private app: Express
	private server: any
	socket: any


	constructor(private port: number) {

		this.app = express()
		
		this.app.use(express.json({ limit: "50mb" }))
		this.app.use(express.urlencoded({limit: "50mb", extended: true, parameterLimit: 50000}))
		this.app.use(cors())

		if(environment === 'test prod'){
			
			const options = {
				key: fs.readFileSync("./../../ssl/keys/f15a6_e242b_9adc49af084fce6a9e6493f1cedb02fd.key"),
				cert: fs.readFileSync("./../../ssl/certs/ippctransaction_com_ca648_2f011_1677769970_ef63cb59405f8ca8d1b98f0e6be176ed.crt")
			 } 

			this.server = https.createServer(options, this.app)
			// this.server = http.createServer(this.app)
			new MainModule(this.app)
			
			const ioConn = new Server(this.server, { cors: { origin: "*" } })
			
			startSocketServer(ioConn)

			watch(ioConn).then(()=>console.log('Waiting for events') )		
			
			this.startServer(this.port).then(() => console.log(`Server is running on port ${ this.port }`))

		}else{

			this.server = http.createServer(this.app)
			
			new MainModule(this.app)

			const ioConn = new Server(this.server, { cors: { origin: "*" } })
			
			startSocketServer(ioConn)

			watch(ioConn).then(()=>console.log('Waiting for events') )


			this.startServer(this.port).then(() => console.log(`Server is running on port ${ this.port }`))		

		}

		
	}

	startServer(port: number) {
		return Promise.resolve(this.server.listen(port))
	}

}





const { DEVELOPMENT, PRODUCTION } = Keywords
const PORT: any = process.env.NODE_ENV === DEVELOPMENT ? process.env.DEV_PORT
				: process.env.NODE_ENV === DEVELOPMENT ? process.env.DEV_PORT
				: process.env.TEST_PROD_PORT

const environment = process.env.NODE_ENV === DEVELOPMENT ? DEVELOPMENT
				: process.env.NODE_ENV === PRODUCTION ? PRODUCTION
				: 'test prod'


new MainServer(PORT)