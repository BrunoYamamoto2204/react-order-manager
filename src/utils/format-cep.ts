export function formatCep(timeString: string) {
    const formattedNumber = timeString.replace(/\D/g, "")

    if(formattedNumber.length <= 5) return formattedNumber

    return formattedNumber.replace(/(\d{5})(\d+)$/, "$1-$2")
    
}