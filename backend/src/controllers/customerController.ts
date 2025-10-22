import { Request, Response } from 'express';
import Customer from "../models/customerModel"

export const getCustomers = async (req: Request, res: Response) => {
    try {
        const customers = await Customer.find().sort({ createdAt: -1})
        res.json(customers)
    } catch(error) {
        res.status(500).json({ 
            message: "(500) - Erro ao buscar clientes: ",
            error: error instanceof Error ? error.message : String(error)
        })
    }
} 

export const getCustomerById = async (req: Request, res: Response) => {
    try{
        const customer = await Customer.findById(req.params.id)
        if(!customer) res.status(404).json({
            message: `(404) - Pedido não encontrado ${req.params.id}`
        })

        res.json(customer)
    } catch(error) {
        res.status(500).json({
            message: `(500) - Erro ao buscar cliente ${req.params.id}`,
            error: error instanceof Error ? error.message : String(error)
        })
    }
}

export const createCustomer = async (req: Request, res: Response) => {
    try{
        const newCustomer = new Customer(req.body)
        const customers = await newCustomer.save()
        res.status(201).json(customers)
    } catch(error) {
        res.status(400).json({
            message: "(400) - Erro ao criar cliente",
            error: error instanceof Error ? error.message : String(error)
        })
    }
}

export const updateCustomer = async (req: Request, res: Response) => {
    try{
        const customers = await Customer.findByIdAndUpdate(req.params.id, req.body)
        if(!customers) res.status(404).json({
            message: `(404) - Pedido não encontrado ${req.params.id}`
        })

        res.json(customers)
    } catch(error) {
        res.status(400).json({
            message: "(400) - Erro ao editar cliente",
            error: error instanceof Error ? error.message : String(error)
        })
    }
}

export const deleteCustomer = async (req: Request, res: Response) => {
    try{
        const customer = await Customer.findByIdAndDelete(req.params.id)
        if(!customer) res.status(404).json({
            message: `(404) - Pedido não encontrado ${req.params.id}`
        })

        res.json(customer)
    } catch(error) { 
        res.status(400).json({
            message: "(400) - Erro ao editar cliente",
            error: error instanceof Error ? error.message : String(error)
        })
    }
}