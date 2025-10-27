import { useEffect, useRef, useState } from "react";
import { getCustomers, type Customer } from "../../services/customersApi";
import styles from "./CustomerSearch.module.css"
import { SearchIcon } from "lucide-react";

type CustomerSearchProps ={
    value: string;
    customerSelected: (selected: boolean) => void;
    onChange: (name: string) => void;
    setCustomerId: (id: string | null) => void;
    placeholder?: string;
    setNoRegister: (noRegister: boolean) => void
}

export default function CustomerSearch({ 
    value, 
    customerSelected, 
    onChange,
    setCustomerId,
    placeholder,
    setNoRegister
}: CustomerSearchProps ) {
    const [ customers, setCustomers] = useState<Customer[]>([])
    const [ filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
    const [ showSuggetions, setShowSuggetions] = useState(false)
    const [ loading, setLoading] = useState(true)

    const inputRef = useRef<HTMLInputElement>(null)
    const dropDownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        loadCustomers()

        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropDownRef.current && 
                !dropDownRef.current.contains(event.target as Node) && 
                !inputRef.current?.contains(event.target as Node)
            ) {
                setShowSuggetions(false)
            }
        } 

        document.addEventListener("mousedown", handleClickOutside)
    }, [])

    useEffect(() => {
        
    },[])

    const loadCustomers = async () => {
        try{
            setCustomers(await getCustomers())
        } catch(error) {
            console.log("[500] - Erro ao carregar clientes: ", error)
        } finally{
            setLoading(false)
        }
    }

    const handleInputChange = (input: string) => {
        onChange(input)

        if(input.trim() === "") {
            setShowSuggetions(false)
            setFilteredCustomers([])
            return 
        }

        const normalizeText = (text: string) =>
            text.normalize("NFD").replace(/[\u0300-\u036f]/g, "")

        const filteredList = customers.filter(customer => 
            normalizeText(customer.name).toLocaleLowerCase()
                .includes(normalizeText(input).toLocaleLowerCase())
        )

        const matchedCustomer = customers.find(customer =>
            normalizeText(customer.name).toLowerCase() === normalizeText(input).toLowerCase()
        );

        if (matchedCustomer) {
            customerSelected(true);
            if (matchedCustomer._id) setCustomerId(matchedCustomer._id);
        } else {
            customerSelected(false);
            setCustomerId(null);
        }

        setShowSuggetions(filteredList.length > 0)
        setFilteredCustomers(filteredList)
    } 

    const choseCustomer = (customer: Customer) => {
        onChange(customer.name)
        customerSelected(true)
        if (customer._id) setCustomerId(customer._id)
        setShowSuggetions(false)
        setNoRegister(false)
    }
    
    return (
        <div className={styles.customerSearch}>
            <div className={styles.inputWithIcon}>
                <SearchIcon className={styles.searchIcon} />
                <input
                    ref={inputRef}
                    id="nome"
                    autoComplete="off"
                    value={value}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder={placeholder}
                />

                {showSuggetions && (
                <div ref={dropDownRef} className={styles.suggestions}>
                    {loading ? (
                        <div>...Carregando</div>
                    ) : (
                        filteredCustomers.length > 0 ? (
                            filteredCustomers.map(customer => (
                                <div 
                                    key={customer._id} 
                                    onClick={() => choseCustomer(customer)}
                                >
                                    <div className={styles.choseItem}>
                                        {customer.name} - {customer.phone}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div>Nenhum cliente encontrado</div>
                        )
                    )}
                </div>
            )}
            </div>
        </div>
    )
}