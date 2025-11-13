export function formatTime(timeString: string) {
    const formattedNumber = timeString.replace(/\D/g, "")

    if(formattedNumber.length === 3) return formattedNumber.replace(/(\d{2})(\d{1})$/, "$1:$2")

    return formattedNumber.replace(/(\d{2})(\d{2})$/, "$1:$2")
    
}