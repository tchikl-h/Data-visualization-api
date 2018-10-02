import {Promise} from 'es6-promise';
import * as fs from 'fs';
import {IMain, IDatabase} from 'pg-promise';
import * as pgPromise from 'pg-promise';

// your protocol extensions:
interface IExtensions {
    executeQuery(query: string): Promise<any>;
}

export default class Aggregator {
    public cn = {
        user: '',
        host: '',
        database: '',
        password: '',
        port: 5432,
        ssl: true
    };
    public options = {
        extend: obj => {
            obj.executeQuery = query => {
                return obj.many(query);
            }
        }
    }
    public pgp: IMain = pgPromise(this.options);
    public db = <IDatabase<IExtensions>&IExtensions>this.pgp(this.cn);
    public data: any;

    constructor() {
    }

    loadJson(filePath: string) {
        this.data = JSON.parse(fs.readFileSync(filePath).toString());
    }

    pushProperType(query: string, field: string) : string {
        if (field === 'title')
            query += '\'title\'';
        else if (field === 'relation'){
            query += "\'"+JSON.stringify(this.data[field]).replace(/\'/g, "").replace(/\[/g, "{").replace(/\]/g, "}")+"\'";
        }
        else if (typeof this.data[field] === 'string')
            query += "\'"+this.data[field].toString().replace(/["']/g, "")+"\'";
        else
            query += this.data[field];
        return query;
    }

    pushJsonToDb(filePath: string) {
        return new Promise<any>((resolve, reject) => {
            this.loadJson(filePath);
            let query = "INSERT INTO data (";
            for(var field in this.data) {
                query += field;
                if (field !== "headerRowIndex")
                    query += ","
            }
            query += ") VALUES (";
            for(var field in this.data) {
                query = this.pushProperType(query, field);
                if (field !== "headerRowIndex")
                    query += ","
            }
            query += ");";
            this.db.executeQuery(query);
            resolve();
        });
    }
}
// let agg = new Aggregator;
// agg.db.executeQuery("select relation from data;")
// .then(res => {
//     console.log(res);
// })
// var files = fs.readdirSync(__dirname+"\\..\\data\\");
// var readFiles = (files) => {
//     var p = Promise.resolve(); // Q() in q
//     files.forEach(file => {
//         p = p.then(() => agg.pushJsonToDb(__dirname+"\\..\\data\\"+file))
//     });
//     return p;
//   };
// readFiles(files);