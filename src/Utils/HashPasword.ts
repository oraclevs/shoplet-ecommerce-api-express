import {genSalt,compare,hash} from "bcrypt";


export class PasswordSecure{
    async HashPassword(password:string) {
        const salt = await genSalt(10);
        const hashed = hash(password, salt);
        return hashed
    }
   async ComparePassWord(hashFromDB:string,Password:string) {
       const hashed = await this.HashPassword(Password)
        const Valid:boolean = await compare(hashFromDB, hashed); 
        return Valid
    }
}
