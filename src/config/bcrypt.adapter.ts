import { compareSync, genSaltSync, hashSync } from "bcryptjs"


export const bcryptAdapter = {

    hash: (password: string, numRounds: number = 11) => {
        const salt = genSaltSync(numRounds);
        return hashSync(password, salt);
    },

    compare: (password: string, hashed: string) => {
        return compareSync(password, hashed);
    }
}