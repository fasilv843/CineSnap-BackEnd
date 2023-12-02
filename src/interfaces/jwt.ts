import { ID } from "./common";

export interface JWT {
    generateToken (userId: ID) :string;
}