import mysql from 'mysql'
import { DatabaseConnections } from './../configs/main.object'

const pool = mysql.createConnection(DatabaseConnections)


pool.connect((err) => {
    if (err) throw err;
    console.log("Database Connected!");
})

export const connection = pool
