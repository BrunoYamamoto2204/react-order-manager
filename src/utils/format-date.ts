import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export function formatBrDate(rawDate: string): string {
    const [year, month, day] = rawDate.split('-').map(Number);
    const date = new Date(year, month - 1, day); 

    return format(date, "EEEE, dd 'de' MMMM 'de' yyyy", {
        locale: ptBR,
    })
}

// "yyyy-MM-dd" --> "dd/MM/yyyy"
export function formatDate(rawDate: string): string {
    const [year, month, day] = rawDate.split('-').map(Number);
    const date = new Date(year, month - 1, day); 

    return format(date, "dd/MM/yyyy", {
        locale: ptBR,
    })
}

// "dd/MM/yyyy" --> "yyyy-MM-dd"
export function formatStringDateTime(rawDate: string) {
    const [ day, month, year ] = rawDate.split("/")
    return `${year}-${month}-${day}`
}
