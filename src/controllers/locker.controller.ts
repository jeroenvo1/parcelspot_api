import { Controller } from './controller';
import { Observable } from 'rxjs';
import { LockerModel } from '../models/locker.model';

export class LockerController extends Controller{
    public tableName = 'locker';

    get(id: number): Observable<any> {
        return Observable.create((observer) => {
            this.db.getConnection((connection) => {
                connection.query(`SELECT * FROM ${this.tableName} WHERE id=?`,
                [id], (error: any, result: any) => {
                    connection.release();
                    if (error) return this.error(observer, 'locker not found');
                    if (result.length === 0) {
                        observer.next([]);
                        observer.complete();
                    } else {
                        let locker = new LockerModel(result[0]);
                        observer.next(locker);
                        observer.complete();
                    }
                })
            })
        });
    }

    getByLockerCode(code: string) {
        return Observable.create((observer) => {

            let parcelId;
            this.db.getConnection((connection) => {
                connection.query(`SELECT id FROM parcel WHERE code = ?`,
                    [code], (error: any, result: any) => {
                        if (error) return this.error(observer, 'locker not found');
                        if (result.length === 0) {
                            return this.error(observer, 'parcel');
                        } else {
                            parcelId = result[0].id;

                            this.db.getConnection((connection) => {
                                connection.query(`SELECT l.* FROM ${this.tableName} l INNER JOIN parcel p ON l.id = p.lockerId WHERE p.code = ?`,
                                    [code], (error: any, result: any) => {
                                        connection.release();
                                        if (error) return this.error(observer, 'locker not found');
                                        if (result.length === 0) {
                                            return this.error(observer, 'locker not found');
                                        } else {
                                            let locker = new LockerModel(result[0]);
                                            locker.id = parcelId;
                                            observer.next(locker);
                                            observer.complete();
                                        }
                                    })
                            })
                        }
                    })
            })


        });
    }

    getByWallId(wallId: number): Observable<any> {
        return Observable.create((observer) => {
            this.db.getConnection((connection) => {
                connection.query(`SELECT * FROM ${this.tableName} WHERE wallId=?`,
                [wallId], (error: any, result: any) => {
                    connection.release();
                    if (error) return this.error(observer, 'lockers not found');

                    let lockers = [];
                    for(let i of result) {
                        lockers.push(new LockerModel(i));
                    }

                    observer.next(lockers);
                    observer.complete();
                })
            })
        });
    }

    getEmptyLockers(wallId: number) {
        return Observable.create((observer) => {
            this.db.getConnection((connection) => {
                connection.query(`SELECT * FROM ${this.tableName} WHERE wallId=? AND occupied = 0`,
                [wallId], (error: any, result: any) => {
                    connection.release();
                    if (error || result.length === 0) return this.error(observer, 'no empty lockers found');

                    let lockers = [];
                    for (let i of result) {
                        lockers.push(new LockerModel(i));
                    }

                    observer.next(lockers);
                    observer.complete();
                })
            })
        });
    }

    reserveLocker(lockerId: number) {
        return this.changeLockerStatus(lockerId, 1);
    }

    freeLocker(lockerId: number) {
        return this.changeLockerStatus(lockerId, 0);
    }

    private changeLockerStatus(lockerId: number, close: number) {
        return Observable.create((observer) => {
            this.db.getConnection((connection) => {
                connection.query(`UPDATE ${this.tableName} SET occupied = ? WHERE id = ?`,
                    [close, lockerId], (error: any, result: any) => {
                        connection.release();
                        if (error) return this.error(observer, 'error changing locker status');
                        if (result.affectedRows === 0) this.error(observer, 'error changing locker status');

                        observer.next({ 'sucess': true });
                        observer.complete();
                    })
            })
        });
    }
}