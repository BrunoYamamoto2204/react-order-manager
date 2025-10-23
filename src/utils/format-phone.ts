
export function formatPhone(number: string) {
    const formattedNumber = number.replace(/\D/g, "")

    if (formattedNumber.length <= 10){
        return formattedNumber
            .replace(/(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{4})(\d{4})$/, "$1-$2")
    }
    else{
        return formattedNumber
            .replace(/(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d{4})$/, "$1-$2")
    }
}