import * as dotenv from "dotenv";

dotenv.config();

let path;
switch (process.env.NODE_ENV) {
    case "dev":
        path = `${__dirname}/dev.env`;
        break;
    case "prod":
        path = `${__dirname}/prod.env`;
        break;
    default:
        path = `${__dirname}/dev.env`;
}
dotenv.config({ path: path });

export const EXPRESSPORT = process.env.EXPRESSPORT;
export const WEBSOCKETPORT = process.env.WEBSOCKETPORT;
export const DBHOST = process.env.DBHOST;
export const DBPORT = process.env.DBPORT;
export const DBUSER = process.env.DBUSER;
export const DBPASSWORD = process.env.DBPASSWORD;
export const DBTYPE = process.env.DBTYPE;
export const MODE = process.env.MODE;
export const SERVER_URL = process.env.SERVER_URL;
export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
