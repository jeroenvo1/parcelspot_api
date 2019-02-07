import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MySQLService } from "../services/mysql.service";
import * as JWT from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import * as FS from 'fs';
import * as path from 'path';
import { UserController } from '../controllers/user.controller';
import { UserModel } from '../models/user.model';
import * as random from 'generate-key';
import { SendGridService } from './sendgrid.service';

export class AuthenticationService {
    private db: MySQLService = new MySQLService();
    public userController: UserController = new UserController();
    public sendGridService: SendGridService = new SendGridService();


    register(user: any): Observable<any> {
        return Observable.create((observer) => {
            let data = ['email', 'password', 'firstName', 'lastName', 'address', 'houseNumber', 'postalCode', 'city'];
            
            let check = this.existInJson(user, data);
            if(check !== true) {
                observer.next(check);
                observer.complete();
            }
            
            user.password = bcrypt.hashSync(user.password, 10);
            let qrKey = random.generateKey();

            this.db.getConnection((connection) => {
                connection.query('INSERT INTO user (email, password, qrCode,  firstName, lastName, address, houseNumber, postalCode, city) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)',
                                        [user.email,
                                        user.password,
                                        qrKey,
                                        user.firstName,
                                        user.lastName,
                                        user.address,
                                        user.houseNumber,
                                        user.postalCode,
                                        user.city], (error: any, result: any) => {
                    connection.release();
                    if (error) {
                        switch (error.code) {
                            case 'ER_DUP_ENTRY':
                                return this.error(observer, 'Email already exist');
                        
                            default:
                                return this.error(observer, 'error');
                        }
                    };

                    
                    
                    observer.next({
                        'succes': true,
                        'message': 'user created'
                    });
                    observer.complete();
                })
            })
        })
    }

    login(user: any, role: string, res: any) {
        this.userController.getByEmail(user.email)
            .subscribe((user: UserModel) => {
                let data = {
                    token: this.signToken(user, role),
                    user: user
                }
                res.send(data);
            })
    };

    loginByQrCode(qrCode: string) {
        return this.userController.getByQrCode(qrCode)
                .pipe(map((user: any) => {
                    if(user.message) {
                        throw user;
                    }

                    let data = {
                        token: this.signToken(user, 'qrCode'),
                        user: user
                    }

                    return data;
                }));
    };

    private signToken(user, role) {
        let cert = FS.readFileSync(path.resolve(__dirname, '../config/cert/jwtRS256.key'));

        let UserToken = {
            role: role,
            id: user.id,
            email: user.email,
            iss: 'ParcelSpotApi'
        };

        let verifyOptions = {
            expiresIn: '365d'
        };

        let token = JWT.sign(UserToken, cert, verifyOptions);
        return token;
    }

    resetPassword(email: string): Observable<any> {
        return Observable.create((observer) => {
            this.userController.getByEmail(email)
                .subscribe((user: any) => {
                    if (user.message) return this.error(observer, 'user not found');

                    let newPassword = random.generateKey(7);
                    let hashPassword = bcrypt.hashSync(newPassword, 10);

                    this.db.getConnection((connection) => {
                        connection.query('UPDATE user SET password=? WHERE email=?',
                        [hashPassword, email], (error: any, result: any) => {
                            connection.release();
                            if (error) this.error(observer, 'error setting new password');

                            this.sendGridService.sendPasswordResetMail(email, newPassword);

                            observer.next({
                                succes: true,
                                message: `New password send to ${email}`
                            });
                            observer.complete();
                        });
                    });
                })
        });
    }

    existInJson(json: {}, data: string[]): {} {
        let missingData = [];
        for(let i of data) {
            if (json[i] === '' || 
                typeof json[i] === 'undefined' ||
                !json[i].replace(/\s/g, '').length) {
                missingData.push(i)
            }
        }

        if(missingData.length > 0) {
            return {
                'succes': false,
                'missingFields': missingData
            }
        }
        return true;
    }

    noResult(observer) {
        let data = {
            'message': 'No results'
        };

        observer.next(data);
        observer.complete();
    }

    error(observer, error) {
        let data = {
            'message': 'error',
            'error': error
        };

        observer.error(data);
        observer.complete();
    }
}