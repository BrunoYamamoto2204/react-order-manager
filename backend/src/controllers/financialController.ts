import { Request, Response } from "express"

import Financial from "../models/financialModel"

export const getIncomesExpenses = async (req: Request, res: Response) => {
    try{
        const incomesExpenses = await Financial.find().sort({ createdAt: -1})
        res.json(incomesExpenses)
    } catch(e) {
        res.status(500).json({
            error: `Erro ao buscar as contas: ${e}`
        })
    }
}

export const getIncomeExpenseById = async (req: Request, res: Response) => {
    try{
        const incomeExpense = await Financial.findById(req.params.id)
        res.json(incomeExpense)
    } catch(e) {
        res.status(500).json({
            error: `Erro ao buscar a conta ${req.params.id}: ${e}`
        })
    }
}

export const createIncomeExpense = async (req: Request, res: Response) => {
    try{
        const newIncomeExpense = new Financial(req.body)
        const savedIncomeExpense = await newIncomeExpense.save()
        res.status(201).json(savedIncomeExpense)
    } catch(e) {
        res.status(400).json({
            error: `Erro ao criar conta: ${e}`
        })
    }
}

export const updateIncomeExpense = async (req: Request, res: Response) => {
    try{
        const incomeExpense = Financial.findByIdAndUpdate(req.params, req.body)
        res.json(incomeExpense)
    } catch(e) {
        res.status(404).json({
            error: `Erro ao editar pedido: ${req.params.id}: ${e}`
        })
    }
}

export const deleteIncomeExpense = async (req: Request, res: Response) => {
    try{
        const incomeExpense = Financial.findByIdAndDelete(req.params.id)
        res.json(incomeExpense)
    } catch(e) {
        res.status(500).json({
            error: `Erro ao excluir pedido: ${req.params.id}: ${e}`
        })
    }
}