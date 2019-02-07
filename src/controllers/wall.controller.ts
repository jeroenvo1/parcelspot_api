import { Controller } from './controller';
import { Observable } from 'rxjs';
import { WallModel } from '../models/wall.model';
import { LockerController } from '../controllers/locker.controller';

export class WallController extends Controller {
    public tableName = 'wall';
    public lockerController: LockerController = new LockerController();

    get(id: number): Observable<any> {
        return Observable.create((observer) => {
            this.db.getConnection((connection) => {
                connection.query(`SELECT * FROM ${this.tableName} WHERE id=?`,
                    [id], (error: any, result: any) => {
                        connection.release();
                        if (error) return this.error(observer, 'wall not found');
                        if (result.length === 0) return this.noResult(observer);
    
                        let wall = new WallModel(result[0]);
    
                        this.lockerController.getByWallId(wall.id)
                            .subscribe((lockers: any) => {
                                wall.setLockers(lockers);
                                
                                observer.next(wall);
                                observer.complete();
                                
                            }, (error: any) => {
                                observer.next(wall);
                                observer.complete();
                            })
                    })
            })

        });
    }

    getByLockerId(lockerId: number) {
        return Observable.create((observer) => {
            this.db.getConnection((connection) => {
                connection.query(`SELECT w.* FROM wall w INNER JOIN locker l ON l.wallId = w.id WHERE l.id = ?`,
                    [lockerId], (error: any, result: any) => {
                        connection.release();
                        
                        observer.next(new WallModel(result[0]));
                        observer.complete();
                    })
            })

        });
    }
}