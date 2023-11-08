import { HashPassword } from "../interfaces/hashPassword";
import bcrypt from 'bcrypt'

export class Encrypt implements HashPassword {

    async encryptPassword (password: string): Promise<string> {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    }

    async comparePasswords(pass: string, hashedPass: string): Promise<boolean> {
        return await bcrypt.compare(pass, hashedPass)
    }
    
}