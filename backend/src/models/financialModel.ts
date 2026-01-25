import mongoose, { Schema, Document } from "mongoose"

interface IFinance extends Document {
    fType: string,
    name: string,
    value: number,
    createdAt?: Date,
    updatedAt?: Date
}

const FinancialSchema = new Schema<IFinance> ({
    fType: { type: String, required: true},
    name: { type: String, required: true},
    value: { type: Number, required: true}
} , {
  timestamps: true
})

const Financial = mongoose.models.Financial 
    || mongoose.model<IFinance>("IncomesExpenses", FinancialSchema, "incomesExpenses")

export default Financial