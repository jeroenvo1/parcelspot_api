export class UserModel {
    public id: string;
    public email: string;
    public firstName: string;
    public lastName: string;
    public address: string;
    public houseNumber: string;
    public postalCode: string;
    public city: string;
    public qrCode: string;

    constructor(user: any) {
        this.id = user.id;
        this.email = user.email;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.address = user.address;
        this.houseNumber = user.houseNumber;
        this.postalCode = user.postalCode;
        this.city = user.city;
        this.qrCode = user.qrCode;
    }
}