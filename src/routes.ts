import { ParcelController } from "./controllers/parcel.controller";
import { ParcelModel } from './models/parcel.model';
import { UserController } from './controllers/user.controller';
import { UserModel } from './models/user.model';
import { LockerController } from './controllers/locker.controller';
import { AuthenticationService } from "./services/authentication.service";
import { MODE } from './enviroments/envoriment';
import * as passport from "passport";
import { PassportService } from './services/passport.service';
import { WallController } from './controllers/wall.controller';
import { CompanyModel } from './models/company.model';

export class Routes {
    private version = '0.2.3';
    public parcelController: ParcelController = new ParcelController();
    public userController: UserController = new UserController();
    public authenticationService: AuthenticationService = new AuthenticationService();
    public passportService: PassportService = new PassportService();
    public wallController: WallController = new WallController();
    public lockerController: LockerController = new LockerController();
    public passportSignInUsername = passport.authenticate('username_password', { session: false });
    public passportSignInQrCode = passport.authenticate('qr_code', { session: false });
    public passportJWT = passport.authenticate('jwt', { session: false });

    public routes(app): void {
        app.get('/', (req, res) => res.send({
                'version': this.version,
                'mode': MODE
            }));


        /**
            * @api {get} /parcel/send Get all send parcels
            * @apiGroup Parcel
            * @apiPermission user
            * @apiHeader {String} Authorization Users unique Authorization token
            * @apiSuccess {Object[]} parcel List of send parcel object
            * @apiSuccessExample {json} Success
            *   HTTP/1.1 200 OK
            {
                [
                    {
                        "id": 49,
                        "description": "Wehkamp",
                        "deliverDate": "2019-02-04T13:34:45.000Z",
                        "code": "asdasddsaadsdas17",
                        "userId": 15,
                        "width": 20,
                        "length": 20,
                        "height": 20,
                        "lockerId": 1,
                        "status": [
                        {
                            "id": 59,
                            "parcelId": 49,
                            "type": "in process",
                            "dateCreated": "2019-02-06T10:53:29.000Z"
                        },
                        {
                            "id": 41,
                            "parcelId": 49,
                            "type": "registered",
                            "dateCreated": "2019-01-09T15:06:37.000Z"
                        }
                        ],
                        "locker": {
                            "id": 1,
                            "location": 0,
                            "wallId": 1,
                            "width": 100,
                            "length": 50,
                            "height": 50
                        },
                        "wall": {
                            "id": 1,
                            "address": "Zuidhoek",
                            "houseNumber": "1",
                            "postalCode": "3082PK",
                            "city": "Rotterdam"
                        }
                    },
                    {
                        "id": 50,
                        "description": "Wehkamp L3",
                        "deliverDate": "2019-02-06T14:39:58.000Z",
                        "code": "asdasddsaadsdas18",
                        "userId": 15,
                        "width": 20,
                        "length": 20,
                        "height": 20,
                        "lockerId": 9,
                        "status": [
                        {
                            "id": 62,
                            "parcelId": 50,
                            "type": "delivered",
                            "dateCreated": "2019-02-06T14:23:18.000Z"
                        },
                        {
                            "id": 60,
                            "parcelId": 50,
                            "type": "in process",
                            "dateCreated": "2019-02-06T10:53:33.000Z"
                        },
                        {
                            "id": 42,
                            "parcelId": 50,
                            "type": "registered",
                            "dateCreated": "2019-01-09T15:07:22.000Z"
                        }
                        ],
                        "locker": {
                            "id": 9,
                            "location": 8,
                            "wallId": 1,
                            "width": 100,
                            "length": 100,
                            "height": 50
                        },
                        "wall": {
                            "id": 1,
                            "address": "Zuidhoek",
                            "houseNumber": "1",
                            "postalCode": "3082PK",
                            "city": "Rotterdam"
                        }
                    }
                ]
            }
            * @apiErrorExample {json} parcel not found
            *   HTTP/1.1 200
            {
                "message": "No results"
            }
            * @apiErrorExample {String} Parcel error
            *   HTTP/1.1 401 Unauthorized
        */
        app.get('/parcel/send', [(req, res, next) => {
            req._role = ['user'];
            next();
        }, this.passportJWT], (req, res) => {
            this.parcelController.getSendParcels(req.user.id)
                .subscribe((parcels: any) => {
                    res.status(201).send(parcels);
                },(error: any) => {
                    res.status(400).send(error);
                })
        });
        
        /**
            * @api {get} /parcel Get all parcels
            * @apiGroup Parcel
            * @apiPermission user
            * @apiHeader {String} Authorization Users unique Authorization token
            * @apiSuccess {Object[]} parcel List of parcel objects
            * @apiSuccessExample {json} Success
            *   HTTP/1.1 200 OK
            [
                {
                    "id": 1,
                    "description": "Zalando pakketje",
                    "deliverDate": "2019-01-09T12:56:45.000Z",
                    "code": "test1",
                    "userId": 13,
                    "width": 0,
                    "length": 0,
                    "height": 0,
                    "lockerId": 1,
                    "status": [
                        {
                            "id": 1,
                            "parcelId": 1,
                            "type": "registered",
                            "dateCreated": "2019-01-07T17:49:25.000Z"
                        }
                    ],
                    "locker": {
                        "id": 1,
                        "location": 0,
                        "wallId": 1,
                        "width": 100,
                        "length": 50,
                        "height": 50
                    }
                },
                {
                    "id": 44,
                    "description": "Wehkamp",
                    "deliverDate": "2019-01-09T23:00:00.000Z",
                    "code": "asdasddsaadsdas",
                    "userId": 13,
                    "width": 20,
                    "length": 20,
                    "height": 20,
                    "lockerId": 4,
                    "status": [
                        {
                            "id": 37,
                            "parcelId": 44,
                            "type": "registered",
                            "dateCreated": "2019-01-09T14:46:42.000Z"
                        }
                    ],
                    "locker": {
                        "id": 4,
                        "location": 3,
                        "wallId": 1,
                        "width": 50,
                        "length": 25,
                        "height": 40
                    },
                    "wall": {
                        "id": 1,
                        "address": "Zuidhoek",
                        "houseNumber": "1",
                        "postalCode": "3082PK",
                        "city": "Rotterdam"
                    }
                }
            ]
            * @apiErrorExample {String} Parcel error
            *   HTTP/1.1 401 Unauthorized
        */
        app.route('/parcel')
            .get([(req, res, next) => {
                req._role = ['user', 'qrCode'];
                next();
            }, this.passportJWT], (req, res) => {
                let user = new UserModel(req.user);

                this.parcelController.getAll(user)
                    .subscribe((parcels: ParcelModel[]) => {
                        res.status(200).send(parcels);
                    }, (error: any) => {
                        res.status(400).send(error);
                    });
            })
            .post([(req, res, next) => {
                this.passportService.checkApiCode(req.headers.authorization)
                    .subscribe((company: CompanyModel) => {
                        req._company = company;
                        next();
                    }, (error: any) => {
                        res.status(400).send(error);
                    })
            }], (req, res) => {
                this.parcelController.createCompanyParcel(req.body, req._company)
                    .subscribe((data: any) => {
                        res.status(201).send({
                            succes: true,
                            "message": "parcel created"
                        });

                    }, (error: any) => {
                        res.status(400).send(error);
                    })
            });
        
        /**
            * @api {get} /parcel/:id Get a parcel by id
            * @apiGroup Parcel
            * @apiPermission user
            * @apiHeader {String} Authorization Users unique Authorization token
            * @apiSuccess {Object[]} parcel List of parcel object
            * @apiSuccessExample {json} Success
            *   HTTP/1.1 200 OK
            {
                "id": 1,
                "description": "Zalando pakketje",
                "deliverDate": "2019-01-09T12:56:45.000Z",
                "code": "test1",
                "userId": 13,
                "width": 0,
                "length": 0,
                "height": 0,
                "lockerId": 1,
                "status": [
                    {
                        "id": 1,
                        "parcelId": 1,
                        "type": "registered",
                        "dateCreated": "2019-01-07T17:49:25.000Z"
                    }
                ],
                "locker": {
                    "id": 1,
                    "location": 0,
                    "wallId": 1,
                    "width": 100,
                    "length": 50,
                    "height": 50
                },
                "wall": {
                    "id": 1,
                    "address": "Zuidhoek",
                    "houseNumber": "1",
                    "postalCode": "3082PK",
                    "city": "Rotterdam"
                }
            }
            * @apiErrorExample {json} parcel not found
            *   HTTP/1.1 200
            {
                "message": "No results"
            }
            * @apiErrorExample {String} Parcel error
            *   HTTP/1.1 401 Unauthorized
        */
        app.get('/parcel/:id', [(req, res, next) => {
            req._role = ['user', 'qrCode'];
            next();
        }, this.passportJWT], (req, res) => {
            this.parcelController.getById(req.params.id, req.user.id)
                .subscribe((parcel: any) => {
                    res.status(201).send(parcel);
                },(error: any) => {
                    res.status(400).send(error);
                })
        });

        /**
         * @api {post} /parcel/user Create a parcel
         * @apiGroup Parcel
         * @apiHeader {String} Authorization Users unique Authorization token
         * @apiParam {String} description Parcel description
         * @apiParam {String} deliverDate Parcel deliverdate
         * @apiParam {String} width Parcel width in cm
         * @apiParam {String} length Parcel length in cm
         * @apiParam {String} height Parcel height in cm
         * @apiParam {number} wallId Id of parcel wall
         * @apiParam {number} userId Id of the receiving user
         * @apiParamExample {json} Input
        {
            "description": "Bol.com pakketje",
            "deliverDate": "2019-01-10",
            "width": "20",
            "length": "20",
            "height": "20",
            "wallId": 1,
            "userId": 15
        }
         * @apiSuccess {Boolean} succes Succes
         * @apiSuccess {String} message Succes message
         * @apiSuccessExample {json} Success
         *   HTTP/1.1 200 OK
        {
            "succes": true,
            "message": "parcel owner created"
        }
         * @apiErrorExample {json} No empty lockers
        {
            "message": "error",
            "error": "no empty lockers found"
        }
         */
        app.post('/parcel/user', [(req, res, next) => {
            req._role = ['user'];
            next();
        }, this.passportJWT], (req, res) => {
            let parcel = req.body;
            parcel.ownerId = req.user.id;

            this.parcelController.createUserParcel(parcel)
                .subscribe((data: any) => {
                    res.status(201).send(data);
                }, (error: any) => {
                    res.status(400).send(error);
                });
        });

        /**
            * @api {get} /parcel/code/:code Get parcel by code
            * @api {post} /parcel/code Get parcel by code
            * @apiGroup Parcel
            * @apiParam {String} code Parcels code
            * @apiSuccessExample {json} Success
            *   HTTP/1.1 200 OK
            {
                "id": 1,
                "description": "Zalando pakketje",
                "deliverDate": "2019-01-09T12:56:45.000Z",
                "code": "test1",
                "userId": 13,
                "width": 0,
                "length": 0,
                "height": 0,
                "lockerId": 1,
                "status": [
                    {
                        "id": 1,
                        "parcelId": 1,
                        "type": "registered",
                        "dateCreated": "2019-01-07T17:49:25.000Z"
                    }
                ],
                "locker": {
                    "id": 1,
                    "location": 0,
                    "wallId": 1,
                    "width": 100,
                    "length": 50,
                    "height": 50
                }
            }
            * @apiErrorExample {json} Status mismatch
            {
                "succes": false,
                "message": "status mismatch"
            }
        */
        app.post('/parcel/code', (req, res) => {
            this.parcelController.getParcelByCode(req.body.code)
                .subscribe((data: any) => {
                    res.status(201).send(data);
                }, (error: any) => {
                    res.status(401).send(error);
                })
        });

        /**
            * @api {get} /parcel/delivery/:code Get parcel by code (for delivery)
            * @apiGroup Parcel
            * @apiParam {String} code Parcels code
            * @apiSuccessExample {json} Success
            *   HTTP/1.1 200 OK
            {
                "locker": {
                    "id": 1,
                    "location": 0,
                    "wallId": 1,
                    "width": 100,
                    "length": 50,
                    "height": 50
                }
            }
            * @apiErrorExample {json} Status mismatch
            {
                "succes": false,
                "message": "status mismatch"
            }
        */
        app.get('/parcel/delivery/:code', (req, res) => {
            this.lockerController.getByLockerCode(req.params.code)
                .subscribe((data: any) => {
                    res.status(201).send(data);
                }, (error: any) => {
                    res.status(401).send(error);
                })
        });

        /**
            * @api {post} /parcel/status Insert parcel status
            * @apiGroup Parcel
            * @apiParam {number} parcelId Id of the parcel
            * @apiParam {String} status Status
            * @apiSuccessExample {json} Success
            *   HTTP/1.1 200 OK
            {
                "succes": true,
                "message": "parcel status created"
            }
            * @apiErrorExample {json} Status mismatch
            {
                "succes": false,
                "message": "error inserting parcel status"
            }
        */
        app.post('/parcel/status', (req, res) => {
            this.parcelController.updateStatus(req.body.parcelId, req.body.status)
                .subscribe((data: any) => {
                    res.status(201).send(data);
                }, (error: any) => {
                    res.status(400).send(error);
                })
        });

        /**
            * @api {get} /parcel/status get list of available status
            * @apiGroup Parcel
            * @apiSuccessExample {json} Success
            *   HTTP/1.1 200 OK
            [
                "registered",
                "in process",
                "delivered",
                "picked up",
                "waiting return",
                "returned",
                "no user found"
            ]
        */
        app.get('/parcel/status', (req, res) => {
            res.status(201).send(this.parcelController.availableStatus);
        });
        
        /**
            * @api {post} /register Register a new account
            * @apiGroup Register
            * @apiParam {String} email Emailadress
            * @apiParam {String} password Password
            * @apiParam {String} firstName First name
            * @apiParam {String} lastName Last name
            * @apiParam {String} address Address
            * @apiParam {String} houseNumber House number
            * @apiParam {String} postalCode Postal code
            * @apiParam {String} city City
            * @apiParamExample {json} Input
            {
                "email": "jeroen_van_ottelen@hotmail.com",
                "password": "jeroen",
                "firstName": "Jeroen",
                "lastName": "van Ottelen",
                "address": "asd",
                "houseNumber": "asd",
                "postalCode": "asd",
                "city": "Rotterdam"
            }
            * @apiSuccess {Boolean} succes Succes
            * @apiSuccess {String} message Succes message
            * @apiSuccessExample {json} Success
            *   HTTP/1.1 200 OK
            {
                "succes": true,
                "message": "user created"
            }
            * @apiErrorExample {json} Register error
            {
                "message": "error",
                "error": "Email already exist"
            }
        */
        app.post('/register', (req, res) => {
            let registerData = req.body;

            this.authenticationService.register(registerData)
                .subscribe((data: any) => {
                    res.send(data);
                });
        });

        /**
            * @api {post} /login Login
            * @apiGroup Login
            * @apiParam {String} email Email adress
            * @apiParam {String} password Password
            * @apiParamExample {json} Input
            {
                "email": "jeroen_van_ottelen@hotmail.com",
                "password": "jeroen"
            }
            * @apiSuccess {String} email Emailadress
            * @apiSuccess {String} password Password
            * @apiSuccess {String} firstName First name
            * @apiSuccess {String} lastName Last name
            * @apiSuccess {String} address Address
            * @apiSuccess {String} houseNumber House number
            * @apiSuccess {String} postalCode Postal code
            * @apiSuccess {String} city City
            * @apiSuccess {String} code base 64 encoded code (png image)
            * @apiSuccessExample {json} Success
            *   HTTP/1.1 200 OK
            {
                "token": "<token>",
                "user": {
                    "id": 13,
                    "email": "jeroen_van_ottelen@hotmail.com",
                    "firstName": "Jeroen",
                    "lastName": "van Ottelen",
                    "address": "asd",
                    "houseNumber": "asd",
                    "postalCode": "asd",
                    "city": "Rotterdam",
                    "code": "data:image/png;base64,<image code>"
                }
            }
            * @apiErrorExample {json} Authorization error
            *   HTTP/1.1 401 Unauthorized
        */
        app.post('/login', this.passportSignInUsername, (req, res) => {
            let loginData = req.body;
            this.authenticationService.login(loginData, 'user', res)
        });

        /**
            * @api {get} /login/:qrcode Login with QR Code
            * @apiGroup Login
            * @apiParam {String} code Users code
            * @apiSuccessExample {json} Success
            *   HTTP/1.1 200 OK
            {
                "token": "<token>",
                "user": {
                    "id": 13,
                    "email": "jeroen_van_ottelen@hotmail.com",
                    "firstName": "Jeroen",
                    "lastName": "van Ottelen",
                    "address": "asd",
                    "houseNumber": "zxc",
                    "postalCode": "zxc",
                    "city": "Rotterdam",
                    "qrcode": "data:image/png;base64,<image code>"
                }
            }
            * @apiErrorExample {json} Authorization error
            *   HTTP/1.1 401 Unauthorized
        */
        app.get('/login/:qrcode', [(req, res, next) => {
            req.body.email = req.params.qrcode;
            req.body.password = req.params.qrcode;
            next();
        }, this.passportSignInQrCode], (req, res) => {
            this.authenticationService.loginByQrCode(req.params.qrcode)
                .subscribe((data: any) => {
                    res.status(201).send(data);
                }, (error: any) => {
                    res.status(401).send(error);
                })
        });

        /**
            * @api {get} /resetpassword/:email Reset password
            * @apiGroup Login
            * @apiParam {String} email Users email address
            * @apiSuccess {Boolean} succes Succes
            * @apiSuccess {String} message Sucess message
            * @apiSuccessExample {json} Success
            *   HTTP/1.1 200 OK
            {
                "succes": true,
                "message": "New password send to jeroen_van_ottelen@hotmail.com"
            }
            * @apiErrorExample {json} User not found
            *   HTTP/1.1 400
            {
                "message": "error",
                "error": "user not found"
            }
            * @apiErrorExample {json} Error setting new password
            *   HTTP/1.1 400
            {
                "message": "error",
                "error": "error setting new password"
            }
        */
        app.get('/resetpassword/:email', (req, res) => {
            this.authenticationService.resetPassword(req.params.email)
                .subscribe((data: any) => {
                    res.status(201).send(data);
                }, (error: any) => {
                    res.status(400).send(error);
                })
        });

        /**
            * @api {get} /user Get user data
            * @apiGroup User
            * @apiPermission user
            * @apiHeader {String} Authorization Users unique Authorization token
            * @apiSuccess {Boolean} succes Succes
            * @apiSuccess {String} token Signed token
            * @apiSuccessExample {json} Success
            *   HTTP/1.1 200 OK
            {
                "id": 17,
                "email": "jeroen2@hotmail.com",
                "firstName": "Jeroen",
                "lastName": "van Ottelen",
                "address": "Zuidhoek",
                "houseNumber": "28A",
                "postalCode": "3082PK",
                "city": "Rotterdam",
                "code": "data:image/png;base64,<image code>"
            }
            * @apiErrorExample {json} Authorization error
            *   HTTP/1.1 401 Unauthorized
        */
        app.get('/user', [(req, res, next) => {
            req._role = ['user'];
            next();
        }, this.passportJWT], (req, res) => {
            res.status(201).send(req.user);
        });


        /**
            * @api {put} /user Update user data
            * @apiGroup User
            * @apiPermission user
            * @apiHeader {String} Authorization Users unique Authorization token
            * @apiParam {String} firstName First name
            * @apiParam {String} lastName Last name
            * @apiParam {String} address Address
            * @apiParam {String} houseNumber House number
            * @apiParam {String} postalCode Postal code
            * @apiParam {String} city City
            * @apiParam {String} oldPassword Current password
            * @apiParam {String} newPassword New password
            * @apiParamExample {json} Input
            {
                "firstName": "Jeroen",
                "lastName": "van Ottelen",
                "address": "ZuidhoekZuidhoek",
                "houseNumber": "28A",
                "postalCode": "3082PK",
                "city": "Rotterdam",
                "oldPassword": "jeroen",
                "newPassword": "new_password"
            }
            * @apiSuccessExample {json} Success
            *   HTTP/1.1 200 OK
            {
                "sucess": true,
                "message": "user jeroen2@hotmail.com updated"
            }
            * @apiErrorExample {json} Authorization error
            *   HTTP/1.1 401 Unauthorized
            * @apiErrorExample {json} Password error
            *   HTTP/1.1 400
            {
                "message": "error",
                "error": "Invalid password"
            }
        */
        app.put('/user', [(req, res, next) => {
            req._role = ['user'];
            next();
        }, this.passportJWT], (req, res) => {
            req.body.id = req.user.id;
            req.body.email = req.user.email;
            
            this.userController.update(req.body)
                .subscribe((data: any) => {
                    res.status(201).send(data);
                }, (error: any) => {
                    res.status(400).send(error);
                });
        });

        /**
            * @api {get} /wall/:id Get wall by id
            * @apiGroup Wall
            * @apiParam {number} id Wall id
            * @apiSuccessExample {json} Success
            *   HTTP/1.1 200 OK
            {
                "id": 1,
                "address": "Zuidhoek",
                "houseNumber": "1",
                "postalCode": "3082PK",
                "city": "Rotterdam",
                "lockers": [
                    {
                        "id": 1,
                        "location": 0,
                        "wallId": 1,
                        "width": 100,
                        "length": 50,
                        "height": 50
                    },
                    {
                        "id": 2,
                        "location": 1,
                        "wallId": 1,
                        "width": 50,
                        "length": 25,
                        "height": 40
                    },
                    {
                        "id": 3,
                        "location": 2,
                        "wallId": 1,
                        "width": 100,
                        "length": 50,
                        "height": 50
                    },
                    {
                        "id": 4,
                        "location": 3,
                        "wallId": 1,
                        "width": 50,
                        "length": 25,
                        "height": 40
                    }
                ]
            }
            * @apiErrorExample {json} User not found
            *   HTTP/1.1 200
            {
                "message": "No results"
            }
        */
        app.get('/wall/:id', (req, res) => {
            this.wallController.get(req.params.id)
                .subscribe((data: any) => {
                    res.status(201).send(data);
                }, (error: any) => {
                    res.status(400).send(error);
                });
        });

        /**
            * @api {get} /user/email/:email Search users by email
            * @apiGroup User
            * @apiParam {String} email User email
            * @apiSuccessExample {json} Success
            *   HTTP/1.1 200 OK
            [
                {
                    "id": 13,
                    "email": "jeroen_van_ottelen@hotmail.com",
                    "firstName": "Jeroen",
                    "lastName": "van Ottelen",
                    "address": "asd",
                    "houseNumber": "asd",
                    "postalCode": "asd",
                    "city": "Rotterdam",
                    "qrCode": "qrCode1"
                },
                {
                    "id": 17,
                    "email": "jeroen2@hotmail.com",
                    "firstName": "jan",
                    "lastName": "van Ottelen",
                    "address": "asd",
                    "houseNumber": "28A",
                    "postalCode": "asd",
                    "city": "Rotterdam",
                    "qrCode": "PMGx6JTMD0Oolsy2"
                }
            ]
            * @apiErrorExample {json} User not found
            *   HTTP/1.1 200
            {
                "message": "No results"
            }
        */
        app.get('/user/email/:email', (req, res) => {
            this.userController.searchByEmail(req.params.email)
                .subscribe((user: UserModel[]) => {
                    res.status(201).send(user);
                })
        });

    }
}
