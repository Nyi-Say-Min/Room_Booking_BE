import user, { User } from "../models/user";
import { BaseRepository } from "./base_repository";
import { UserInterface } from "../interfaces/user";
import bcrypt from 'bcrypt';
import { CreateUserInput, Role, UserRecord } from "../types/user";

function toUserRecord(document: User): UserRecord {
    return {
        id: document.id.toString(),
        name: document.name,
        password: document.password,
        role: document.role,
    };
}

export class UserRepository extends BaseRepository<User> implements UserInterface{
    constructor() {
        super(user);
    }

    async createUser(data: CreateUserInput): Promise<UserRecord> {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const newUser = new user({
            ...data,
            password: hashedPassword,
        });
        const savedUser = await this.createDocument(newUser);
        return toUserRecord(savedUser);
    }

    async findById(id: string): Promise<UserRecord | null> {
        const existingUser = await this.findDocumentById(id);
        return existingUser ? toUserRecord(existingUser) : null;
    }

    async findByName(name: string): Promise<UserRecord | null> {
        const existingUser = await this.model.findOne({ name }).exec();
        return existingUser ? toUserRecord(existingUser) : null;
    }

    async findAll(): Promise<UserRecord[]> {
        const users = await this.findAllDocuments();
        return users.map(toUserRecord);
    }

    async updateRole(id: string, role: Role): Promise<UserRecord | null> {
        const updatedUser = await this.model.findByIdAndUpdate(id, { role }, { new: true }).exec();
        return updatedUser ? toUserRecord(updatedUser) : null;
    }

    async delete(id: string): Promise<boolean> {
        return this.deleteDocument(id);
    }
}
