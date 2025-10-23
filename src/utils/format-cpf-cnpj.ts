
export function formatCpfCpnj(value: string ) {
    const formattedValue = value.replace(/\D/g, "")

    if (formattedValue.length <= 11){
        return formattedValue
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    } else{
        return formattedValue
            .replace(/^(\d{2})(\d)/, "$1.$2")
            .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/\.(\d{3})(\d)/, ".$1/$2")
            .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
    }
}