import bcrypt from 'bcrypt';
import { conflict, forbidden, notFound, unauthorized } from "../errors/app_error";
import { BookingInterface } from "../interfaces/booking";
import { UserInterface } from "../interfaces/user";
import { CreateUserInput, Role, SigninInput, UserDTO, UserRecord } from "../types/user";

export class UserService{
    constructor(
        private repository: UserInterface,
        private bookingRepository?: Pick<BookingInterface, "deleteManyByUserId">,
    ){
    }

    private toDTO(user: UserRecord): UserDTO {
        return {
            id: user.id,
            name: user.name,
            role: user.role,
        };
    }

    async bootstrapSignup(data: CreateUserInput): Promise<UserDTO>{
        const users = await this.repository.findAll();

        if(users.length > 0) {
            throw forbidden("Signup is only available for the first admin user");
        }

        return this.createUser({
            ...data,
            role: "admin",
        });
    }

    async createUser(data: CreateUserInput): Promise<UserDTO>{
        const existing = await this.repository.findByName(data.name);

        if(existing) {
            throw conflict("User already exists");
        }
        
        const user = await this.repository.createUser(data);
        return this.toDTO(user);
    }

    async authenticateUser(input: SigninInput): Promise<UserDTO> {
        const user = await this.repository.findByName(input.name);
        if(!user) {
            throw unauthorized("Invalid credentials");
        }

        const isPasswordMatch = await bcrypt.compare(input.password, user.password);
        if(!isPasswordMatch){
            throw unauthorized("Invalid credentials")
        }

        return this.toDTO(user);
    }

    async getUsers(): Promise<UserDTO[]> {
        const users = await this.repository.findAll();
        return users.map((user) => this.toDTO(user));
    }

    async getUserById(id: string) {
        const user = await this.repository.findById(id);
        return user ? this.toDTO(user) : null;
    }

    async updateUserRole(id: string, role: Role): Promise<UserDTO> {
        const user = await this.repository.updateRole(id, role);

        if(!user) {
            throw notFound("User not found");
        }

        return this.toDTO(user);
    }

    async deleteUser(id: string): Promise<void> {
        const user = await this.repository.findById(id);

        if(!user) {
            throw notFound("User not found");
        }

        await this.bookingRepository?.deleteManyByUserId(id);
        await this.repository.delete(id);
    }
}
