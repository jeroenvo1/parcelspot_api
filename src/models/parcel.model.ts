import { WallModel } from "./wall.model";

export class ParcelModel {
    public id: string;
    public description: string;
    public deliverDate: string;
    public code: string;
    public userId: number;
    public width: number;
    public length: number;
    public height: number;
    public lockerId: number;
    public status: [];
    public locker: any;
    public wall: WallModel;

    constructor(parcel: any) {
        this.id = parcel.id;
        this.description = parcel.description;
        this.deliverDate = parcel.deliverDate;
        this.code = parcel.code;
        this.userId = parcel.userId;
        this.width = parcel.width;
        this.length = parcel.length;
        this.height = parcel.height;
        this.lockerId = parcel.lockerId;
    }

    public setStatus(status: []) {
        this.status = status;
    }

    public setLocker(locker: any) {
        this.locker = locker;
    }

    public setWall(wall: WallModel) {
        this.wall = wall;
    }
}