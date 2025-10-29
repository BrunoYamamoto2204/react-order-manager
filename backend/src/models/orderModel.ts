import mongoose, { Schema, Document } from "mongoose"

type IProduct = {
    uniqueId: number
    productId: string;
    product: string;
    price: string;
    quantity: number;
    unit: string;
}

const ProductSchema = new Schema<IProduct>({
    uniqueId: { type: Number, required: true },
    productId: { type: String, required: true },
    product: { type: String, required: true },
    price: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true }
}, { _id: false });

export interface IOrder extends Document {
    customerId?: string;
    name: string,
    noRegister: boolean,
    date: string,
    productsStrings: string[],
    products: IProduct[],
    value: string,
    discount: string,
    discountValue: string,
    discountType: string,
    totalGross: string,
    obs: string,
    status: string,
    createdAt?: Date,
    updatedAt?: Date
}

const OrderSchema = new Schema<IOrder>({
    customerId: { type: String },
    name: {type: String, required: true, trim: true },
    noRegister: {type: Boolean, required: true},
    date: {type: String, required: true },
    productsStrings: [{ type: String }],
    products: [ProductSchema],
    value: { type: String, required: true },
    discount: { type: String, default: "0"},
    discountValue: { type: String, default: "0" },
    discountType: { type: String, enum: ["%", "R$"], default: "%" },
    totalGross: { type: String, required: true },
    obs: { type: String, default: "0"},
    status: { type: String, enum: ["Pendente", "Concluído", "Cancelado"], default:"Pendente"}
}, {
    timestamps: true
})

const Order = mongoose.models.Orders || mongoose.model<IOrder>("Orders", OrderSchema, "orders");
export default Order;
