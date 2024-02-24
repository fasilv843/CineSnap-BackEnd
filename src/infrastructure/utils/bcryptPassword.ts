import { IEncryptor } from "../../application/interfaces/utils/encryptor";
import bcrypt from 'bcrypt'

export class Encryptor implements IEncryptor {

    // To encrypt password using salt
    async encryptPassword (password: string): Promise<string> {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    }

    // To compare a password and hashed password are same or not
    async comparePasswords(pass: string, hashedPass: string): Promise<boolean> {
        return await bcrypt.compare(pass, hashedPass)
    }
    
}