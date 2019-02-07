import { Controller } from './controller';
import { Observable } from 'rxjs';
import { CompanyModel } from '../models/company.model';

export class CompanyController extends Controller {
    public tableName = 'company';

    get(id: number): Observable<any> {
        return this.getItem({
            column: 'id',
            value: id
        });
    }

    getByApiKey(apiKey: string): Observable<any> {
        return this.getItem({
            column: 'apiKey',
            value: apiKey
        });
    }

    private getItem(item: {column, value}) {
        return Observable.create((observer) => {
            this.db.getConnection((connection) => {
                connection.query(`SELECT * FROM ${this.tableName} WHERE ${item.column}=?`,
                    [item.value], (error: any, result: any) => {
                        connection.release();
                        if (error) return this.error(observer, 'company not found');
                        if (result.length === 0) return this.noResult(observer);

                        let company = new CompanyModel(result[0]);
                        observer.next(company);
                        observer.complete();
                    })
            })
        });
    }
}