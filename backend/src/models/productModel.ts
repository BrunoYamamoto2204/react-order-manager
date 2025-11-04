import mongoose, { Schema } from "mongoose"

interface IProduct extends Document {
    product: string,
    price: number,
    category: string,
    unit: string,
    description?: string
}

const ProductSchema = new Schema<IProduct> ({
    product: { type: String, required: true},
    price: { type: Number, required: true}, 
    category: { type: String, required: true} ,
    unit: { type: String, required: true} ,
    description: { type: String, required: false } ,
})

const Product = mongoose.models.Products 
    || mongoose.model<IProduct>("Products", ProductSchema, "products")
export default Product

