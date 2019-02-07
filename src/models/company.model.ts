export class CompanyModel {
    public id: number;
    public name: string;
    
    constructor(company: any) {
        this.id = company.id;
        this.name = company.name;
    }
}