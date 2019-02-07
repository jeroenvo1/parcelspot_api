import { Controller } from './controller';
import { Observable, forkJoin } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ParcelModel } from '../models/parcel.model';
import { UserModel } from '../models/user.model';
import { WallController } from '../controllers/wall.controller';
import { LockerController } from '../controllers/locker.controller';
import { LockerModel } from '../models/locker.model';
import { UserController } from '../controllers/user.controller';
import { WallModel } from 'models/wall.model';
import * as random from 'generate-key';

export class ParcelController extends Controller {
    public tableName = 'parcel';
    public wallController: WallController = new WallController();
    public lockerController: LockerController = new LockerController();
    public userController: UserController = new UserController();
    public availableStatus: any = ['registered', 'in process', 'delivered', 'picked up', 'waiting return', 'returned', 'no user found'];

    getById(id: number, userId: number) {
        return Observable.create((observer) => {
            this.db.getConnection((connection) => {
                connection.query(`SELECT * FROM ${this.tableName} WHERE id = ? AND userId = ?`, [id, userId], (error: any, result: any) => {
                    connection.release();
                    if (error) return this.error(observer, 'parcel not found');
                    if (result.length === 0) return this.noResult(observer);

                    let parcel = new ParcelModel(result[0]);

                    observer.next(parcel);
                    observer.complete();
                })
            })
        })
        .pipe(
            catchError(error => { throw error }),
            mergeMap((parcel: any) => {
                return this.getParcelStatus(parcel.id)
                    .pipe(
                        catchError(error => {
                            throw error
                        }),
                        map((parcelStatus: any) => {
                            parcel.setStatus(parcelStatus)
                            return parcel;
                        }));
            }),
            mergeMap((parcel: any) => {
                return this.lockerController.get(parcel.lockerId)
                    .pipe(
                        catchError(error => {
                            throw error
                        }),
                        map((locker: any) => {
                            parcel.setLocker(locker);
                            return parcel;
                        }));
            }),
            mergeMap((parcel: any) => {
                return this.wallController.getByLockerId(parcel.lockerId)
                    .pipe(
                        catchError(error => {
                            throw error
                        }),
                        map((wall: WallModel) => {
                            parcel.setWall(wall);
                            return parcel;
                        }));
            }))
    }

    getAll(user: UserModel) {
        return Observable.create((observer) => {
            this.db.getConnection((connection) => {
                connection.query(`SELECT * FROM ${this.tableName} WHERE userId = ?`,[user.id], (error: any, result: any) => {
                    connection.release();
                    if (error) return this.error(observer, error);
                    if (result.length === 0) return this.noResult(observer);

                    let parcels = [];
                    for (let i of result) {
                        parcels.push(new ParcelModel(i))
                    }
                    
                    observer.next(parcels);
                    observer.complete();
                })
            })
        })
        .pipe(
            catchError(error => { throw error }),
            mergeMap((parcels: any) => {
                return forkJoin(
                    parcels.map((parcel) => {
                        return this.getParcelStatus(parcel.id)
                            .pipe(
                                catchError(error => {
                                    throw error
                                }),
                                map((status: any) => {
                                    parcel.setStatus(status);
                                    return parcel;
                                })
                            )
                    })
                )
            }),
            mergeMap((parcels: any) => {
                return forkJoin(
                    parcels.map((parcel) => {
                        return this.lockerController.get(parcel.lockerId)
                            .pipe(
                                catchError(error => {
                                    throw error
                                }),
                                map((locker: any) => {
                                    parcel.setLocker(locker);
                                    return parcel;
                                })
                            )
                    })
                )
            }),
            mergeMap((parcels: any) => {
                return forkJoin(
                    parcels.map((parcel) => {
                        return this.wallController.getByLockerId(parcel.lockerId)
                            .pipe(
                                catchError(error => {
                                    throw error
                                }),
                                map((wall: WallModel) => {
                                    parcel.setWall(wall);
                                    return parcel;
                                })
                            )
                    })
                )
            })
        )
    }

    getSendParcels(userId: number) {
        return Observable.create((observer) => {
            this.db.getConnection((connection) => {
                connection.query(`SELECT p.* FROM ${this.tableName} p INNER JOIN parcelOwner pa ON p.id = pa.parcelId WHERE pa.type = 'user' AND pa.ownerId = ?`, [userId], (error: any, result: any) => {
                    connection.release();
                    if (error) return this.error(observer, "error getting parcels");
                    if (result.length === 0) return this.noResult(observer);

                    let parcels = [];
                    for (let i of result) {
                        parcels.push(new ParcelModel(i))
                    }

                    observer.next(parcels);
                    observer.complete();
                })
            })
        })
        .pipe(
            catchError(error => { throw error }),
            mergeMap((parcels: any) => {
                return forkJoin(
                    parcels.map((parcel) => {
                        return this.getParcelStatus(parcel.id)
                            .pipe(
                                catchError(error => {
                                    throw error
                                }),
                                map((status: any) => {
                                    parcel.setStatus(status);
                                    return parcel;
                                })
                            )
                    })
                )
            }),
            mergeMap((parcels: any) => {
                return forkJoin(
                    parcels.map((parcel) => {
                        return this.lockerController.get(parcel.lockerId)
                            .pipe(
                                catchError(error => {
                                    throw error
                                }),
                                map((locker: any) => {
                                    parcel.setLocker(locker);
                                    return parcel;
                                })
                            )
                    })
                )
            }),
            mergeMap((parcels: any) => {
                return forkJoin(
                    parcels.map((parcel) => {
                        return this.wallController.getByLockerId(parcel.lockerId)
                            .pipe(
                                catchError(error => {
                                    throw error
                                }),
                                map((wall: WallModel) => {
                                    parcel.setWall(wall);
                                    return parcel;
                                })
                            )
                    })
                )
            })
        )
    }

    getParcelByCode(code: number) {
        return Observable.create((observer) => {
            this.db.getConnection((connection) => {
                connection.query(`SELECT * FROM ${this.tableName} WHERE code = ?`,[code], (error: any, result: any) => {
                    connection.release();
                    if (error) return this.error(observer, error);
                    if (result.length === 0) return this.noResult(observer);

                    observer.next(new ParcelModel(result[0]));
                    observer.complete();
                })
            })
        })
        .pipe(
            catchError(error => { throw error }),
            mergeMap((parcel: any) => {
                return this.getParcelStatus(parcel.id)
                    .pipe(
                        catchError(error => {
                            throw error
                        }),
                        map((parcelStatus: any) => {
                            this.checkValidStatus(parcelStatus);
                            parcel.setStatus(parcelStatus)
                            return parcel;
                        }));
            }),
            mergeMap((parcel: any) => {
                return this.lockerController.get(parcel.lockerId)
                    .pipe(
                        catchError(error => {
                            throw error
                        }),
                        map((locker: any) => {
                            parcel.setLocker(locker);
                            return parcel;
                        }));
            }))
    }

    checkValidStatus(parcelStatus) {
        let status = ['delivered', 'picked up', 'waiting return', 'returned', 'no user found'];
        for(let i of status) {
            for(let j of parcelStatus) {
                if (i === j.type) {
                    throw {
                        succes: false,
                        message: 'status mismatch'
                    }
                }
            }
        }
    }

    create(parcel: any, ownerType: string) {

        let statusArray = [];
        switch(ownerType) {
            case 'company':
                statusArray = ['registered'];
                break;
            case 'user':
                statusArray = ['registered', 'in process', 'delivered'];
                break;
        }

        return this.insertParcel(parcel)
            .pipe(
                catchError(error => { throw error }),
                mergeMap((item: any) => {
                    parcel.id = item.id;
                    return this.updateOwnerId(parcel.id, ownerType, parcel.ownerId)
                        .pipe(catchError(error => { throw error }))
                }),
                mergeMap((item: any) => {
                    return forkJoin(
                        statusArray.map((status) => {
                            return this.updateStatus(parcel.id, status)
                                .pipe(catchError(error => { throw error }))
                        }))
                })
            );
    }

    insertParcel(parcel: any) {
        return Observable.create((observer) => {
            this.db.getConnection((connection) => {
                connection.query(`INSERT INTO ${this.tableName} (description, deliverDate, code, userId, width, length, height, lockerId) VALUES(?, ?, ?, ?, ?, ?, ?, ?)`,
                    [parcel.description,
                    parcel.deliverDate,
                    parcel.code,
                    parcel.userId,
                    parcel.width,
                    parcel.length,
                    parcel.height,
                    parcel.lockerId,
                    ], (error: any, result: any) => {
                        connection.release();
                        if (error) return this.error(observer, 'error inserting parcel');

                        observer.next({
                            succes: true,
                            message: 'parcel created',
                            id: result.insertId
                        });
                        observer.complete();
                    })
            })
        })
    }

    getParcelStatus(parcelId: number) {
        return Observable.create((observer) => {
            this.db.getConnection((connection) => {
                connection.query(`SELECT * FROM parcelStatus WHERE parcelId = ? ORDER BY id DESC`,
                [parcelId], (error: any, result: any) => {
                    connection.release();
                    if (error) return this.error(observer, 'error getting status');

                    let parcelStatus = [];
                    for (let i of result) {
                        parcelStatus.push(i)
                    }

                    observer.next(parcelStatus);
                    observer.complete();
                })
            })
        })
    }

    updateStatus(parcelId: number, status: string) {
        return Observable.create((observer) => {
            if (!this.availableStatus.includes(status)) {
                return this.error(observer, 'status not valid');
            }

            this.db.getConnection((connection) => {
                connection.query(`SELECT * FROM parcelStatus WHERE parcelId = ? AND type = ?`,
                [parcelId, status], (error: any, result: any) => {
                    connection.release();
                    if (error) return this.error(observer, 'error inserting parcel status');
                    if (result.length === 0) {
                        this.db.getConnection((connection) => {
                            connection.query(`INSERT INTO parcelStatus (parcelId, type) VALUES(?, ?)`,
                                [parcelId, status ], (error: any, result: any) => {
                                    if (error) return this.error(observer, 'error inserting parcel status');

                                    observer.next({
                                        'succes': true,
                                        'message': 'parcel status created'
                                    });
                                    observer.complete();
                                })
                        })
                    } else {
                        observer.next([]);
                        observer.complete();
                    }
                })
            })
        })
    }

    updateOwnerId(parcelId: number, type: string, ownerId: number) {
        return Observable.create((observer) => {
            this.db.getConnection((connection) => {
                connection.query(`INSERT INTO parcelOwner (parcelId, type, ownerId) VALUES(?, ?, ?)`,
                [parcelId,
                    type,
                    ownerId], (error: any, result: any) => {
                    connection.release();
                    if (error) return this.error(observer, 'error inserting parcel owner');

                    observer.next({
                        'succes': true,
                        'message': 'parcel owner created'
                    });
                    observer.complete();
                })
            })
        })
    }

    createCompanyParcel(item: any, company: any) {
        item.ownerId = company.id;
        let data = ['description', 'deliverDate', 'code', 'firstName', 'lastName', 'address', 'houseNumber', 'postalCode', 'postalCode', 'city', 'width', 'length', 'height', 'wallId'];
        
        let check = this.existInJson(item, data);
        if (check !== true) {
            throw JSON.stringify(check);
        }

        return this.userController.findByAddress(item)
                    .pipe(
                        catchError(error => { throw error }),
                        mergeMap((user: any) => {
                            item.userId = user.id;
                            return this.lockerController.getEmptyLockers(item.wallId)
                                .pipe(catchError(error => { throw error }))
                        }),
                        mergeMap((lockers: any) => {
                            let locker = this.fitsInLocker(item, lockers);
                            item.lockerId = locker.id;
                            return this.lockerController.reserveLocker(locker.id)
                                .pipe(catchError(error => {
                                    throw error
                                }))
                        }),
                        mergeMap((data: any) => {
                            return this.create(item, 'company')
                                .pipe(catchError(error => {
                                    this.lockerController.freeLocker(item.lockerId)
                                        .subscribe((data: any) => { })
                                    throw error
                                }))
                        })
                    );
    }

    createUserParcel(item: any) {
        item.code = null;
        let data = ['description', 'deliverDate', 'width', 'length', 'height', 'wallId', 'userId'];
        
        item.code = random.generateKey(12);
        let check = this.existInJson(item, data);
        if (check !== true) {
            throw JSON.stringify(check);
        }

        return this.userController.get(item.userId)
            .pipe(
                catchError(error => { throw error }),
                mergeMap((user: any) => {
                    item.firstName = user.firstName;
                    item.lastName = user.lastName;
                    item.address = user.address;
                    item.houseNumber = user.houseNumber;
                    item.postalCode = user.postalCode;
                    item.city = user.city;

                    return this.lockerController.getEmptyLockers(item.wallId)
                        .pipe(catchError(error => {
                            throw error
                        }))
                }),
                mergeMap((lockers: any) => {
                    let locker = this.fitsInLocker(item, lockers);
                    item.lockerId = locker.id;
                    return this.lockerController.reserveLocker(locker.id)
                        .pipe(catchError(error => {
                            throw error
                        }))
                }),
                mergeMap((data: any) => {
                    return this.create(item, 'user')
                        .pipe(catchError(error => {
                            this.lockerController.freeLocker(item.lockerId)
                                .subscribe((data: any) => { })
                            throw error
                        }))
                })
            );

    }

    fitsInLocker(item: any, lockers: [LockerModel]): any {
        for(let i of lockers) {
            if( item.height < i.height &&
                item.length < i.length &&
                item.width < i.width) {
                    return i;
                }
        }

        throw {
            'succes': false,
            'message': 'no fitting lockers found'
        }
    }

    existInJson(json: {}, data: string[]): {} {
        let missingData = [];
        
        for (let i of data) {
            if (json[i] === null ||
                typeof json[i] === 'undefined') {
                missingData.push(i)
            }
        }

        if (missingData.length > 0) {
            return {
                'succes': false,
                'missingFields': missingData
            }
        }
        return true;
    }
}