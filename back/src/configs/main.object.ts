import dotenv from 'dotenv'
dotenv.config()

import { DatabaseConfigs } from './../utils/main.interfaces'
import { Keywords } from './../utils/main.enums'

const { DEVELOPMENT, PRODUCTION } = Keywords

export const ReplicatorConfig: DatabaseConfigs = {
	host: process.env.NODE_ENV === DEVELOPMENT? "localhost" : "localhost",
	user: process.env.NODE_ENV === DEVELOPMENT ? "replicator" : process.env.REPLICATOR_USERNAME,
	password: process.env.NODE_ENV === DEVELOPMENT ? '' : process.env.REPLICATOR_PASSWORD
}

export const DatabaseConnections: DatabaseConfigs = {
    host: process.env.NODE_ENV === DEVELOPMENT ? "localhost" : "localhost",
    user: process.env.NODE_ENV === DEVELOPMENT ? "root"
        : process.env.NODE_ENV === PRODUCTION ? "rootcpan_ippctransaction"
        : "",
    password: process.env.NODE_ENV === DEVELOPMENT ? "" : "4dww9u$~aEds",
    database: process.env.NODE_ENV === DEVELOPMENT ? "ipaypaymentcenter"
            : process.env.NODE_ENV === PRODUCTION ? "rootcpan_ipaydb"
            : ""
}