export class InvalidKeyException {
    name: string = "invalidKeyException";
    message: string;
    constructor(message: string) {
        this.message = message;
    }
}
