import {genSalt,compare,hash} from "bcrypt";


export class PasswordSecure{
    async HashPassword(password:string) {
        const salt = await genSalt(10);
        const hashed = hash(password, salt);
        return hashed
    }
    async ComparePassWord(Password: string, hashFromDB: string) {
    //    const hashed = await this.HashPassword(Password)
       const Valid: boolean = await compare(Password, hashFromDB); 
        return Valid
    }
}
