import mongoose, { Schema, Document } from "mongoose"

interface IProductType extends Document {
    name: string,
    description?: string,
    createdAt?: Date,
    updatedAt?: Date
}

const ProductTypeSchema = new Schema<IProductType>({
    name: {type: String, required: true},
    description: {type: String, required: false},
}, {
    timestamps: true
})

const ProductType = mongoose.models.ProductType ||
    mongoose.model<IProductType>("ProductType", ProductTypeSchema, "productType")

export default ProductType