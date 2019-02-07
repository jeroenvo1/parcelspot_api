import { LockerModel } from './locker.model';

export class WallModel {
    public id: number;
    public address: string;
    public houseNumber: string;
    public postalCode: string;
    public city: string;
    public lockers: [LockerModel];

    constructor(wall: any) {
        this.id = wall.id;
        this.address = wall.address;
        this.houseNumber = wall.houseNumber;
        this.postalCode = wall.postalCode;
        this.city = wall.city;
    }

    public setLockers(lockers: [LockerModel]) {
        this.lockers = lockers;
    }
}