import mongoose, { Schema, Document } from "mongoose"

interface IFinance extends Document {
    date: string,
    description: string,
    category: string,
    account: string,
    value: number,
    createdAt?: Date,
    updatedAt?: Date
}

const FinancialSchema = new Schema<IFinance> ({
    date: { type: String, required: true},
    description: { type: String, required: true},
    category: { type: String, required: true},
    account: { type: String, required: true},
    value: { type: Number, required: true}
} , {
  timestamps: true
})

const Financial = mongoose.models.Financial 
    || mongoose.model<IFinance>("Financial", FinancialSchema, "financial")

export default Financial