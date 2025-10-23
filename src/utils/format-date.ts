import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export function formatBrDate(rawDate: string): string {
    const [year, month, day] = rawDate.split('-').map(Number);
    const date = new Date(year, month - 1, day); 

    return format(date, "EEEE, dd 'de' MMMM 'de' yyyy", {
        locale: ptBR,
    })
}

export function formatDate(rawDate: string): string {
    const [year, month, day] = rawDate.split('-').map(Number);
    const date = new Date(year, month - 1, day); 

    return format(date, "dd/MM/yyyy", {
        locale: ptBR,
    })
}

