import { Request, Response } from 'express';
import Order from '../models/orderModel';
import Customer from '../models/customerModel';

export const getOrders = async (req: Request, res: Response) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1})
        res.json(orders)
    } catch (error) {
        res.status(500).json({
            message: "Erro ao buscar pedidos",
            error: error instanceof Error ? error.message : String(error)
        })
    }
}

export const getOrderById = async (req: Request, res: Response) => {
    try{
        const order = await Order.findById(req.params.id)

        if(!order) {
            return res.status(404).json({ message: `Pedido ${req.params.id} não encontrado` })
        }

        res.json(order)
    } catch (error) {
        res.status(500).json({
            message: `Erro ao buscar pedido ${req.params.id}`,
            error: error instanceof Error ? error.message : String(error)
        })
    }
}

export const createOrder = async (req: Request, res: Response) => {
    try {
        const newOrder = new Order(req.body)
        const savedOrder = await newOrder.save()
        res.status(201).json(savedOrder)
    } catch (error) {
        res.status(400).json({
            message: "Erro ao criar pedido",
            error: error instanceof Error ? error.message : String(error)
        })
    }
}

export const updateOrder = async (req: Request, res: Response) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id, 
            req.body,
            {
                new: true,
                runValidators: true
            }
        )
        
        if (!updatedOrder) {
            return res.status(404).json({message: `Erro ao editar pedido ${req.body.id}`})
        }

        res.json(updatedOrder)
    } catch(error) {
        res.status(400).json({
            message: `Erro ao buscar pedidos`,
            error: error instanceof Error ? error.message : String(error)
        })
    }
}

export const deleteOrder = async (req: Request, res: Response) => {
    try{
        const order = await Order.findById(req.params.id)
        const deletedOrder = await Order.findByIdAndDelete(req.params.id)

        if (!deletedOrder) {
            res.status(400).json({
                message: `Erro ao excluir pedido ${req.body.id}`
            })
        }

        const customer = await Customer.findById(order.customerId)

        if(customer) {
            const validateCustomer = await Order.findOne({
                customerId: order.customerId,
                status: "Pendente"
            })

            await Customer.findByIdAndUpdate(order.customerId, {
                pendingOrders: !!validateCustomer
            })
        }

        res.json({ message: 'Pedido deletado com sucesso' });
    } catch (error) {
        res.status(500).json({
            message: `Erro ao excluir pedido ${req.params.id}`,
            error: error instanceof Error ? error.message : String(error)
        })
    }
}