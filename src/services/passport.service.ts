import * as passport from "passport";
import * as passportLocal from "passport-local";
import * as passportJWT from "passport-jwt";
import { Observable } from 'rxjs';
import { UserController } from '../controllers/user.controller';
import { UserModel } from '../models/user.model';
import * as bcrypt from 'bcrypt';
import * as FS from 'fs';
import * as path from 'path';
import * as _ from 'lodash';
import { CompanyController } from '../controllers/company.controller';

export class PassportService {
    public userController: UserController = new UserController();
    public companyController: CompanyController = new CompanyController();

    constructor() {
        this.initJWTStrategy();
        this.initLocalStrategy();
    }

    initJWTStrategy() {
        let cert = FS.readFileSync(path.resolve(__dirname, '../config/cert/jwtRS256.key'));

        passport.use(new passportJWT.Strategy({
            jwtFromRequest: this.getTokenFromHeaders,
            secretOrKey: cert,
            passReqToCallback: true
        }, (req, paylode, done) => {
            try {
                if (!_.includes(req._role, paylode.role)) {
                    let error = {
                        'error': true,
                        'message': 'Role not permitted'
                    }

                    return done(null, false, error);
                }

                this.userController.getByEmail(paylode.email)
                    .subscribe((user: UserModel) => {
                        if (user.email === paylode.email) {
                            done(null, user);
                            return;
                        }

                        let error = {
                            'error': true,
                            'message': 'Token not valid'
                        }
                        return done(null, false, error);
                    });

            } catch (error) {
                done(error, false);
            }
        }));
    }

    initLocalStrategy() {
        passport.use('username_password', new passportLocal.Strategy({
            usernameField: 'email'
        }, (email, password, done) => {
            this.userController.getHashedPassword(email)
                .subscribe((data: any) => {
                    let hashedPassword = data[0].password;

                    if (!hashedPassword) {
                        return done(null, false);
                    }

                    bcrypt.compare(password, hashedPassword, (err, res) => {
                        if (!res) {
                            return done(null, false);
                        }

                        done(null, data);
                    });
                });
            
        }));

        passport.use('qr_code', new passportLocal.Strategy({
            usernameField: 'email'
        }, (qrCode, password, done) => {
            this.userController.getByQrCode(qrCode)
                .subscribe((user: UserModel) => {
                    if (!user) return done(null, false);
                    done(null, user);
                });
        }));
    }

    checkApiCode(apiKey: string): Observable<any> {
        return Observable.create((observer) => {
            this.companyController.getByApiKey(apiKey)
                .subscribe((company: any) => {
                    observer.next(company);
                    observer.complete();
                }, (error: any) => {
                    this.error(observer);
                })

        });
    }

    error(observer) {
        let data = {
            'message': 'error',
            'error': 'invalid api key'
        };

        observer.error(data);
        observer.complete();
    }

    getTokenFromHeaders = (req) => {
        const { headers: { authorization } } = req;
        return authorization;
    };
}