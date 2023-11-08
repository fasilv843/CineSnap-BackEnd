

export interface HashPassword {
    encryptPassword (password: string) :Promise<string>;
    comparePasswords (pass: string, hashedPass:string) :Promise<boolean>;
}