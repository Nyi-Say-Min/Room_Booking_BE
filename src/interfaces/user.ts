import { CreateUserInput, Role, UserRecord } from "../types/user";

export interface UserInterface{
    createUser(data: CreateUserInput): Promise<UserRecord>;
    findById(id: string): Promise<UserRecord | null>;
    findByName(name: string) : Promise<UserRecord | null>;
    findAll(): Promise<UserRecord[]>;
    updateRole(id: string, role: Role): Promise<UserRecord | null>;
    delete(id: string): Promise<boolean>;
}
