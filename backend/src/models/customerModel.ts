import mongoose, { Schema } from "mongoose"

interface ICustomer {
    name: string,
    cpfCnpj: string,
    phone: string,
    email: string,
    pendingOrders: boolean,
    road?: string,
    num?: string,
    neighborhood?: string, 
    city?: string,
    state?: string,
    cep?: string,
    obs: string,
    createdAt?: Date,
    updatedAt?: Date 
}

const customerSchema = new Schema<ICustomer>({
    name: {type: String, required: true},
    cpfCnpj: {type: String, required: true},
    phone: {type: String, required: true},
    email: {type: String, required: true},
    pendingOrders: {type: Boolean, required: true},
    road: {type: String, required: false},
    num: {type: String, required: false},
    neighborhood: {type: String, required: false}, 
    city: {type: String, required: false},
    state: {type: String, required: false},
    cep: {type: String, required: false},
    obs: {type: String, required: false}
}, {
    timestamps: true
})

const Customer = mongoose.models.Customers || mongoose.model<ICustomer>("Customers", customerSchema)
export default Customer 