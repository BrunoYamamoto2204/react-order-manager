import mongoose, { Schema } from "mongoose"

interface IProduct extends Document {
    product: string,
    price: number,
    category: string,
    unit: string,
    quantity: number,
    description?: string,
    createdAt?: Date,
    updatedAt?: Date
}

const ProductSchema = new Schema<IProduct> ({
    product: { type: String, required: true},
    price: { type: Number, required: true}, 
    category: { type: String, required: true} ,
    unit: { type: String, required: true} ,
    quantity: { type: Number, required: true},
    description: { type: String, required: false } ,
}, {
    timestamps: true
})

const Product = mongoose.models.Products 
    || mongoose.model<IProduct>("Products", ProductSchema, "products")
export default Product

