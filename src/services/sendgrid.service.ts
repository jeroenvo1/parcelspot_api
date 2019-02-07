import { SENDGRID_API_KEY } from "../enviroments/envoriment";
import * as sendgrid from '@sendgrid/mail';

export class SendGridService {

    constructor() {
        sendgrid.setApiKey(SENDGRID_API_KEY);
    }

    sendPasswordResetMail(email: string, password: string) {
        let msg = {
            to: email,
            from: 'jeroen_van_ottelen@hotmail.com',
            subject: 'ParcelSpot wachtwoord',
            text: `Nieuw ParcelSpot wachtwoord: ${password}`
        };
        sendgrid.send(msg);
    }
}