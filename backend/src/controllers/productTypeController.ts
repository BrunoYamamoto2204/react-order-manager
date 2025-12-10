import { Request, Response } from 'express';
import ProductType from '../models/productTypeModel';

export const getProductType = async (req: Request, res: Response) => {
    try {
        const productTypes = await ProductType.find()
        res.json(productTypes)
    } catch(error) {
        res.json(500).json({
            error: `Erro ao buscar os tipos: ${error}`
        })
    }
}

export const getProductTypeById = async (req: Request, res: Response) => {
    try {
        const productType = await ProductType.findById(req.params.id)
        if (!productType) {
            res.status(404).json({message: `Tipo [ ${req.params.id} ] não encontrado`})
        }

        res.json(productType)
    } catch (error) {
        res.json(500).json({
            error: `Erro ao buscar tipo ${req.params.id}: ${error}`
        })
    }
}

export const createProductType = async (req: Request, res: Response) => {
    try {
        const newProductType = new ProductType(req.body)
        const productTypes = await newProductType.save()
        res.json(productTypes)
    } catch (error) {
        res.json(400).json({
            error: `Erro ao criar tipo ${req.params.id}: ${error}`
        })
    }
}

export const updateProductType = async (req: Request, res: Response) => {
    try{
        const productTypes = await ProductType.findByIdAndUpdate(req.params.id, req.body)
        if (!productTypes) {
            res.status(404).json({message: `Tipo [ ${req.params.id} ] não encontrado`})
        }

        res.json(productTypes)
    } catch (error) {
        res.json(400).json({
            error: `Erro ao editar tipo ${req.params.id}: ${error}`
        })
    }
}


export const deleteProductType = async (req: Request, res: Response) => {
    try{
        const productTypes = await ProductType.findByIdAndDelete(req.params.id)
        if (!productTypes) {
            res.status(404).json({message: `Tipo [ ${req.params.id} ] não encontrado`})
        }

        res.json(productTypes)
    } catch (error) {
        res.json(400).json({
            error: `Erro ao excluir tipo ${req.params.id}: ${error}`
        })
    }
}