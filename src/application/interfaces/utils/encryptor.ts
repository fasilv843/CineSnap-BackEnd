

export interface IEncryptor {
    encryptPassword (password: string) :Promise<string>;
    comparePasswords (pass: string, hashedPass:string) :Promise<boolean>;
}