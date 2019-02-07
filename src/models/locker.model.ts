export class LockerModel {
    public id: string;
    public location: number;
    public wallId: string;
    public width: number;
    public length: number;
    public height: number;

    constructor(locker: any) {
        this.id = locker.id;
        this.location = locker.location;
        this.wallId = locker.wallId;
        this.width = locker.width;
        this.length = locker.length;
        this.height = locker.height;
    }
}