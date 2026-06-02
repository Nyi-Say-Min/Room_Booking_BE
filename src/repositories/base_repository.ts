import { Document, Model } from "mongoose";

export class BaseRepository<T extends Document> {
    protected readonly model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    protected async createDocument(data: Partial<T>): Promise<T> {
        const newItem = new this.model(data);
        return newItem.save();
    }

    protected async findDocumentById(id: string): Promise<T | null> {
        return this.model.findById(id).exec();
    }

    protected async findAllDocuments(): Promise<T[]> {
        return this.model.find().exec();
    }

    protected async updateDocument(id: string, item: Partial<T>): Promise<T | null> {
        return this.model.findByIdAndUpdate(id, item, {new: true}).exec();
    }

    protected async deleteDocument(id: string): Promise<boolean> {
        const result = await this.model.findByIdAndDelete(id);
        return result !== null;
    }
}
