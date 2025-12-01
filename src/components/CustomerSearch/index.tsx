import { useEffect, useRef, useState } from "react";
import { getCustomers, type Customer } from "../../services/customersApi";
import styles from "./CustomerSearch.module.css"
import { SearchIcon } from "lucide-react";

type CustomerSearchProps ={
    customerName: string;
    customerSelected: (selected: boolean) => void;
    onChange: (name: string) => void;
    setCustomerId: (id: string | null) => void;
    placeholder?: string;
    noRegister: boolean
    setNoRegister: (noRegister: boolean) => void
}

export default function CustomerSearch({ 
    customerName, 
    customerSelected, 
    onChange,
    setCustomerId,
    placeholder,
    noRegister,
    setNoRegister
}: CustomerSearchProps ) {
    const [ customers, setCustomers] = useState<Customer[]>([])
    const [ filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
    const [ showSuggestions, setShowSuggetions] = useState(false)
    const [ loading, setLoading] = useState(true)
    const [ selectedIndex, setSelectedIndex ] = useState(0)

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
            customerSelected(false);
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

        // Valida se estiver escrito certo manualmente 
        if (matchedCustomer && matchedCustomer._id) {
            customerSelected(true);
            setCustomerId(matchedCustomer._id);
        } else {
            customerSelected(false);
            setCustomerId(null);
        }

        setShowSuggetions(true)
        setFilteredCustomers(filteredList)
    } 

    // Escolhe o cliente 
    const choseCustomer = (customer: Customer) => {
        onChange(customer.name)
        customerSelected(true)
        if (customer._id) setCustomerId(customer._id)
        setShowSuggetions(false)
        setNoRegister(false)
    }

    const handleKeyClick = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "ArrowDown") {
            event.preventDefault()
            setSelectedIndex(prev => prev < filteredCustomers.length - 1 ? prev + 1 : prev)
        }

        if (event.key === "ArrowUp") {
            event.preventDefault()
            setSelectedIndex(prev => prev > 0 ? prev - 1 : 0)
        }

        if (event.key === "Enter" && customerName) {
            event.preventDefault()
            const selectedCustomer = filteredCustomers[selectedIndex]

            onChange(selectedCustomer.name)
            customerSelected(true)
            if (selectedCustomer._id) setCustomerId(selectedCustomer._id)
            setShowSuggetions(false)
            setNoRegister(false)
        }
    }
    
    return (
        <div className={styles.customerSearch}>
            <div className={styles.inputWithIcon}>
                <SearchIcon className={styles.searchIcon} />
                <input
                    ref={inputRef}
                    id="nome"
                    autoComplete="off"
                    value={customerName}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder={placeholder}
                    onKeyDown={handleKeyClick}
                />

                {!noRegister && (showSuggestions && (
                    <div ref={dropDownRef} className={styles.suggestions}>
                        {loading ? (
                            <div>...Carregando</div>
                        ) : (
                            filteredCustomers.length > 0 ? (
                                filteredCustomers.map((customer, index) => (
                                    <div 
                                        key={customer._id} 
                                        onClick={() => choseCustomer(customer)}
                                        onMouseDown={() => setSelectedIndex(index)}
                                    >
                                        <div className={`${styles.choseItem} ${
                                            index === selectedIndex ? styles.selected : ""
                                        }`}>
                                            {customer.name} - {customer.phone}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className={styles.choseItem}>
                                    Nenhum cliente encontrado
                                </div>
                            )
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
