import { MySQLService } from "../services/mysql.service";

export class Controller {
    public db: MySQLService = new MySQLService();

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