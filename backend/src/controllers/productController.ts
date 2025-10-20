import { Request, Response } from 'express';
import Product from "../models/productModel"

export const getProducts = async (req: Request, res: Response) => {
    try{
        const products = await Product.find().sort({ createdAt: -1 })
        res.json(products)
    } catch (error) {
        res.status(500).json({
            message: "Erro ao buscar produtos",
            error: error instanceof Error ? error.message : String(error) 
        })
    }
}

export const getProductById = async (req: Request, res: Response) => {
    try{
        const product = await Product.findById(req.params.id)

        if (!product) {
            return res.status(404).json({ message: `Produto ${req.params.id} não encontrado`})
        }
        res.json(product)
    } catch(error) {
        res.status(500).json({
            message: `Erro ao buscar produto ${req.params.id}`,
            error: error instanceof Error ? error.message : String(error)
        })
    }
}

export const createProduct = async (req: Request, res: Response) => {
    try{
        const newProduct = new Product(req.body)
        const products = await newProduct.save()
        res.status(201).json(products)
    } catch(error){
        res.status(400).json({
            message: "Erro ao criar produto",
            error: error instanceof Error ? error.message : String(error)
        })
    }
}

export const updateProduct = async (req: Request, res: Response) => {
    try{
        const products = await Product.findByIdAndUpdate(req.params.id, req.body)
        if (!products) {
            return res.status(404).json({ message: `Produto ${req.params.id} não encontrado`})
        }
        res.json(products)
    } catch(error) {
        res.status(400).json({
            message: "Erro ao atualizar produto",
            error: error instanceof Error ? error.message : String(error)
        })
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    try{
        const products = await Product.findByIdAndDelete(req.params.id)
        if (!products) {
            res.status(404).json({ message: `Produto ${req.params.id} não encontrado`})
        } 
        res.json(products)
    } catch(error) {
        res.status(400).json({
            message: `Erro ao Excluir o produto ${req.params.id}`,
            error: error instanceof Error ? error.message : String(error)
        })
    }
}