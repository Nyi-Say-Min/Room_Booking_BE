import { IBaseRepository } from "../interfaces/base_repository";

export default class BaseService<T> {
    protected repository: IBaseRepository<T>;

    constructor(repository: IBaseRepository<T>) {
        this.repository = repository;
    }

    async create(data: Partial<T>): Promise<T> {
        return this.repository.create(data);
    }
    
    async findById(id: string): Promise<T | null> {
        return this.repository.findById(id);
    }

    async findAll(): Promise<T[]> {
        return this.repository.findAll();
    }

    async update(id: string, item: Partial<T>): Promise<T | null> {
        return this.repository.update(id, item)
    }

    async delete(id: string): Promise<boolean> {
       return await this.repository.delete(id);
    }
}