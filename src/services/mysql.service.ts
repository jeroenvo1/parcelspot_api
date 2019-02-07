var mysql = require('mysql');
import { DBHOST, DBTYPE, DBUSER, DBPASSWORD } from "../enviroments/envoriment";

export class MySQLService {
    private pool: any;

    constructor() {
        this.pool = mysql.createPool({
            connectionLimit: 0,
            host: DBHOST,
            user: DBUSER,
            password: DBPASSWORD,
            database: DBTYPE
        });
    }

    public getConnection(callBack: any) {
        return this.pool.getConnection((error, connection) => {
            if (error) throw error;
            callBack(connection);
        });
    }
}
