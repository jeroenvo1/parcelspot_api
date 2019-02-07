import { Controller } from './controller';
import { Observable } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import * as qrcode from 'qrcode';
import * as bcrypt from 'bcrypt';
var cleaner = require('deep-cleaner');

export class UserController extends Controller {
    public tableName = 'user';

    get(id: number): Observable<any> {
        return this.getUser({
            column: 'id',
            value: id
        });
    }
    
    getByEmail(email: string): Observable<any> {
        return this.getUser({
            column: 'email',
            value: email
        });
    }

    getByQrCode(qrCode: string): Observable<any> {
        return this.getUser({
            column: 'qrCode',
            value: qrCode
        });
    }

    private getUser(item: {column, value}) {
        return Observable.create((observer) => {
            this.db.getConnection((connection) => {
                connection.query(`SELECT id, email, qrCode, firstName, lastName, address, houseNumber, postalCode, city FROM ${this.tableName} WHERE ${item.column}=?`,
                    [item.value], (error: any, result: any) => {
                        connection.release();
                        if (error) return this.error(observer, 'user not found');
                        if (result.length === 0) return this.noResult(observer);

                        qrcode.toDataURL(result[0].qrCode, (err, url) => {
                            result[0].qrCode = url;

                            let user = new UserModel(result[0]);

                            observer.next(user);
                            observer.complete();
                        })
                    })
            })
        });
    }

    searchByEmail(email: string): Observable<any> {
        return Observable.create((observer) => {
            this.db.getConnection((connection) => {
                connection.query(`SELECT id, email, qrCode, firstName, lastName, address, houseNumber, postalCode, city FROM ${this.tableName} WHERE email LIKE '%${email}%'`,
                (error: any, result: any) => {
                    connection.release();
                    if (error) return this.error(observer, 'user not found');
                    if (result.length === 0) return this.noResult(observer);

                    let users = [];
                    for (let i of result) {
                        users.push(new UserModel(i))
                    }

                    observer.next(users);
                    observer.complete();
                })
            })
        });
    }

    getHashedPassword(email: string) {
        return Observable.create((observer) => {
            this.db.getConnection((connection) => {
                connection.query(`SELECT password FROM ${this.tableName} WHERE email=?`,
                [email], (error: any, result: any) => {
                    connection.release();
                    if (result.length === 0) return this.noResult(observer);

                    observer.next(result);
                    observer.complete();
                })
            })
        });
    }

    update(user: any): Observable<any> {
        return Observable.create((observer) => {
            cleaner(user);

            let updateUser = {
                firstName: user.firstName,
                lastName: user.lastName,
                address: user.address,
                houseNumber: user.houseNumber,
                postalCode: user.postalCode,
                city: user.city
            };

            let fields = '';
            let values = [];
            for(let i in updateUser) {
                fields += `${i}=?, `;
                values.push(updateUser[i]);
            }
            fields = fields.substring(0, fields.length - 2);

            this.db.getConnection((connection) => {
                connection.query(`UPDATE ${this.tableName} set ${fields} WHERE id=${user.id}`, values, (error: any, result: any) => {
                    connection.release();
                    if (error) return this.error(observer, 'update error');

                    if (user.oldPassword && user.newPassword) {
                        this.updatePassword(user.email, user.oldPassword, user.newPassword)
                            .subscribe((data: any) => {
                                observer.next(data);
                                observer.complete();
                            }, (error: any) => {
                                observer.error(error);
                                observer.complete();
                            })
                    } else {
                        observer.next({
                            sucess: true,
                            message: `user ${user.email} updated`
                        });
                        observer.complete();
                    }
                        
                })
            })

        });
    }

    updatePassword(email: string, oldPassword: string, newPassword: string): Observable<any> {
        return Observable.create((observer) => {
            this.getHashedPassword(email)
                .subscribe((data: any) => {
                    let hashedPassword = data[0].password;

                    bcrypt.compare(oldPassword, hashedPassword, (err, res) => {
                        if (!res) {
                            observer.error({
                            'message': 'error',
                                'error': 'Invalid password'
                            });
                        }

                        newPassword = bcrypt.hashSync(newPassword, 10);
                        this.db.getConnection((connection) => {
                            connection.query(`UPDATE ${this.tableName} set password = ? WHERE email='${email}'`,
                                newPassword, (error: any, result: any) => {
                                let returnMessage = {
                                    sucess: true,
                                    message: `user ${email} updated`
                                };

                                observer.next(returnMessage);
                                observer.complete();
                            })
                        })

                    });
                })
        })
    }

    findByAddress(address: any) {
        return Observable.create((observer) => {
            this.db.getConnection((connection) => {
                connection.query(`  SELECT id, email, qrCode, firstName, lastName, address, houseNumber, postalCode, city FROM ${this.tableName}
                                        WHERE firstName LIKE '%${address.firstName}%'
                                        AND lastName LIKE '%${address.lastName}%'
                                        AND address LIKE '%${address.address}%'
                                        AND houseNumber LIKE '%${address.houseNumber}%'
                                        AND postalCode LIKE '%${address.postalCode}%'
                                        AND city LIKE '%${address.city}%'`,
                (error: any, result: any) => {
                    connection.release();
                    if (error) return this.error(observer, 'user not found');
                    if (result.length === 0) {
                        let emptyUser = {
                            id: null,
                            email: null,
                            firstName: null,
                            lastName: null,
                            address: null,
                            houseNumber: null,
                            postalCode: null,
                            city: null,
                            qrCode: null
                        }
                        
                        observer.next(emptyUser);
                        observer.complete();
                    } else {
                        let user = new UserModel(result[0]);
    
                        observer.next(user);
                        observer.complete();
                    }
                })
            })
        });
    }
}