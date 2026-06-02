export type Role = "admin" | "owner" | "user";

export type UserRecord = {
    id: string;
    name: string;
    password: string;
    role: Role;
};

export type UserDTO = {
    id: string;
    name: string;
    role: Role;
}

export type CreateUserInput = {
    name: string;
    password: string;
    confirmPassword?: string;
    role?: Role;    
};

export type SigninInput = {
    name: string;
    password: string;
};

export type UpdateUserRoleInput = {
    role: Role;
};
