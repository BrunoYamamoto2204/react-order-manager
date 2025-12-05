import { TrashIcon } from "lucide-react"
import styles from "../../pages/Pedidos/CreatePedido.module.css"
import type { OrderProduct } from "../../pages/Pedidos/createPedido"
import { useEffect, useState } from "react"


type CreateOrderListProps = {
    productList : OrderProduct[]
    changeQuantity : (newQuantity : number, productId: string) => void
    removeProduct: (listItem: OrderProduct) => void
}

export function CreateOrderList({ 
    productList, 
    changeQuantity, 
    removeProduct
} : CreateOrderListProps) {
    const [ isMobile ,setIsMobile ] = useState(false)

    useEffect(() => {
        document.title = "Novo Pedido - Comanda"

        const mediaQueryMobile = window.matchMedia("(max-width: 1050px)")
        setIsMobile(mediaQueryMobile.matches)

        const handleMobile = (e: MediaQueryListEvent) => {
            setIsMobile(e.matches)
        }

        mediaQueryMobile.addEventListener("change", handleMobile)
        return () => {
            mediaQueryMobile.removeEventListener("change", handleMobile)
        }
    },[])

    if (isMobile) {
        return (
            <>
                {productList.map((product, index) => {
                    const total = product.quantity * Number(product.price)

                    return(
                        <div key={`${product.product}_${index}`} className={styles.mqProducts}>
                            <div className={styles.mqProductHeader}>
                                <h3 style={{margin:"0"}}>{product.product}</h3>
                                <div 
                                    className={`${styles.icon} ${styles.itemTopLine}`}
                                    onClick={() => removeProduct(product)}>
                                    <TrashIcon />
                                </div>
                            </div>
                            <div className={styles.mqProductInfo}>
                                {/* Quantity */}
                                <div className={styles.mqProductInfoBox}>
                                    <label>Quantidade</label>
                                    <input
                                        style={{marginTop:"1rem"}}
                                        onChange={e => {
                                            const newQuantity = e.target.value
                                            const validateQuantity = Math.max(0, Number(newQuantity))
                                            changeQuantity(validateQuantity, product.uniqueId.toString())
                                        }}
                                        value={product.quantity}
                                        type="number"
                                    />
                                </div>

                                {/* Unit */}
                                <div className={styles.mqProductInfoBox}>
                                    <label>Unidade</label>
                                    <p>{product.unit}</p>
                                </div>

                                {/* Product Unit Price */}
                                <div className={styles.mqProductInfoBox}>
                                    <label>Preço Unitário</label>
                                    <p>R$ {product.price}</p>
                                </div>
                            </div>

                            <hr />
                            
                            {/* Total Value */}
                            <div>
                                <div className={styles.mqProductTotalBox}>
                                    <label>Subtotal</label>
                                    <p>R$ {total.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </>
        )
    }
        
    return (
        <>
            {productList.map((product, index) => {
                const total = product.quantity * Number(product.price)

                return (
                    <tr key={`${product.product}_${index}`}>
                        {/* Product Name */}
                        <td className={styles.itemTopLine}>
                            {product.product}
                        </td>

                        {/* Product Price */}
                        <td className={styles.itemTopLine}>
                            <input
                                onChange={e => {
                                    const newQuantity = e.target.value
                                    const validateQuantity = Math.max(0, Number(newQuantity))
                                    changeQuantity(validateQuantity, product.uniqueId.toString())
                                }}
                                value={product.quantity}
                                type="number"
                            />
                        </td>

                        {/* Product Unit */}
                        <td className={styles.itemTopLine}>
                            {product.unit}
                        </td>

                        {/* Product Unit Price */}
                        <td className={styles.itemTopLine}>
                            R$ {product.price}
                        </td>

                        {/* Total Value */}
                        <td className={styles.itemTopLine} >
                            R$ {total.toFixed(2)}
                        </td>
                        
                        {/* Delete Product */}
                        <td 
                            className={`${styles.icon} ${styles.itemTopLine}`}
                            onClick={() => removeProduct(product)}>
                            <TrashIcon />
                        </td>
                    </tr>
                )
            })}
        </>
    )
}
