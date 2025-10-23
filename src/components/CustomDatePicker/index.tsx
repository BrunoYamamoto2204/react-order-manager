// ========== PARTE 1: IMPORTS E DEPENDÊNCIAS ==========
import { useState } from 'react';           // Hook para gerenciar estado
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'; // Ícones
import styles from './CustomDatePicker.module.css'; // Estilos CSS Modules

// ========== PARTE 2: INTERFACES (CONTRATOS DE TIPOS) ==========

// Define o que o componente espera receber como props
interface CustomDatePickerProps {
    displayValue : (date : string) => string
    value: string;                    // Data selecionada (formato "YYYY-MM-DD")
    onChange: (date: string) => void; // Função chamada quando data muda
    placeholder?: string;             // Texto quando não há data (opcional)
    disabled?: boolean;               // Se o componente está desabilitado (opcional)
    minDate?: string;                // Data mínima permitida (opcional)
    maxDate?: string;                // Data máxima permitida (opcional)  
    dateName? : string
    className?: string;               // Classes CSS extras (opcional)
}

// Define a estrutura de cada dia no calendário
interface CalendarDay {
    day: number | null;      // Número do dia (1-31) ou null para espaços vazios
    isCurrentMonth: boolean; // Se o dia pertence ao mês atual
    isSelected: boolean;     // Se o dia está selecionado
    isToday: boolean;        // Se o dia é hoje
    isDisabled: boolean;     // Se o dia está desabilitado
}

// ========== PARTE 3: DECLARAÇÃO DO COMPONENTE ==========
export function CustomDatePicker({
    displayValue,
    value,                           // Data atual selecionada
    onChange,                        // Função para mudar a data
    placeholder = "Selecione a data", // Valor padrão se não informado
    disabled = false,                // Valor padrão se não informado
    minDate,                         // Pode ser undefined
    maxDate,                         // Pode ser undefined
    dateName,
    className = ""                   // Valor padrão se não informado
}: CustomDatePickerProps) {

    // ========== PARTE 4: ESTADOS (useState) ==========
    
    // Controla se o calendário está aberto ou fechado
    const [isOpen, setIsOpen] = useState<boolean>(false);
    
    // Controla qual mês/ano está sendo mostrado no calendário
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
    // new Date() = data atual (ex: 31/08/2025)

    // ========== PARTE 5: FUNÇÕES UTILITÁRIAS ==========
    
    // Converte "2025-08-31" para "31/08/2025" (para mostrar ao usuário)
    const formatDateForDisplay = (dateString: string): string => {
        if (!dateString) return placeholder; // Se vazio, mostra placeholder
        return displayValue(dateString)
    };

    // Verifica se uma data deve estar desabilitada
    const isDateDisabled = (date: Date): boolean => {
        // Converte Date para string no formato do input ("YYYY-MM-DD")
        const dateString = date.toISOString().split('T')[0];
        
        // Se tem data mínima E a data é menor que a mínima
        if (minDate && dateString < minDate) return true;
        
        // Se tem data máxima E a data é maior que a máxima
        if (maxDate && dateString > maxDate) return true;
        
        return false; // Não está desabilitada
    };

    // Verifica se uma data é hoje
    const isToday = (date: Date): boolean => {
        const today = new Date(); // Data atual
        // Compara as strings de data (ignora horário)
        return date.toDateString() === today.toDateString();
    };

    // FUNÇÃO MAIS COMPLEXA: Gera todos os dias do calendário
    const getDaysInMonth = (date: Date): CalendarDay[] => {
        const year = date.getFullYear();    // 2025
        const month = date.getMonth();      // 7 (agosto = 7, pois janeiro = 0)
        
        // Primeiro dia do mês (1º de agosto)
        const firstDay = new Date(year, month, 1);
        
        // Último dia do mês (31 de agosto) 
        const lastDay = new Date(year, month + 1, 0); // Dia 0 do próximo mês = último dia do atual
        
        const daysInMonth = lastDay.getDate();        // 31 (quantos dias tem agosto)
        const startingDayOfWeek = firstDay.getDay();  // 4 (quinta-feira, se 1º agosto for quinta)

        const days: CalendarDay[] = []; // Array que vai conter todos os dias
        
        // ETAPA 1: Adiciona espaços vazios no início
        // Se o mês começa numa quinta (4), precisa de 4 espaços vazios antes
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push({
                day: null,              // Não há dia
                isCurrentMonth: false,  // Não é do mês atual
                isSelected: false,      // Não pode estar selecionado
                isToday: false,         // Não pode ser hoje
                isDisabled: true        // Está desabilitado
            });
        }
        
        // ETAPA 2: Adiciona os dias reais do mês (1, 2, 3... 31)
        for (let day = 1; day <= daysInMonth; day++) {
            // Cria objeto Date para este dia específico
            const currentDate = new Date(year, month, day);
            const dateString = currentDate.toISOString().split('T')[0];
            
            days.push({
                day,                                    // 1, 2, 3... 31
                isCurrentMonth: true,                   // É do mês atual
                isSelected: value === dateString,       // Compara com data selecionada
                isToday: isToday(currentDate),          // Verifica se é hoje
                isDisabled: isDateDisabled(currentDate) // Verifica se deve estar desabilitado
            });
        }
        
        return days; // Retorna array com ~35-42 elementos (depende do mês)
    };

    // ========== PARTE 6: HANDLERS (FUNÇÕES DE EVENTO) ==========
    
    // Chamada quando usuário clica em um dia
    const handleDateClick = (calendarDay: CalendarDay): void => {
        // Se não tem dia ou está desabilitado, não faz nada
        if (!calendarDay.day || calendarDay.isDisabled) return;
        
        // Reconstrói a data completa
        const year = currentMonth.getFullYear();    // 2025
        const month = currentMonth.getMonth();      // 7 (agosto)
        const selectedDate = new Date(year, month, calendarDay.day); // Nova data
        
        // Converte para formato string que o input entende
        const formattedDate = selectedDate.toISOString().split('T')[0]; // "2025-08-15"
        
        onChange(formattedDate); // Chama função do componente pai
        setIsOpen(false);        // Fecha o calendário
    };

    // Navega para mês anterior (-1) ou próximo (+1)
    const navigateMonth = (direction: -1 | 1): void => {
        const newMonth = new Date(currentMonth); // Cria cópia da data atual
        newMonth.setMonth(currentMonth.getMonth() + direction); // +1 ou -1 mês
        setCurrentMonth(newMonth); // Atualiza o estado
    };

    // Seleciona a data de hoje
    const handleTodayClick = (): void => {
        const today = new Date().toLocaleDateString("sv-SE"); 
        onChange(today);  // Atualiza a data selecionada
        setIsOpen(false); // Fecha o calendário
    };

    // Limpa a seleção (deixa vazio)
    const handleClearClick = (): void => {
        onChange('');     // String vazia
        setIsOpen(false); // Fecha o calendário
    };

    // Abre/fecha o calendário (só se não estiver desabilitado)
    const handleToggle = (): void => {
        if (!disabled) {
            setIsOpen(!isOpen); // Inverte o estado: true -> false, false -> true
        }
    };

    // ========== PARTE 7: CONSTANTES ==========
    
    // Nomes dos meses em português
    const monthNames: string[] = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    // Nomes dos dias da semana (abreviados)
    const weekDays: string[] = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    // ========== PARTE 8: FUNÇÕES DE CLASSE CSS (LÓGICA VISUAL) ==========
    
    // Determina as classes CSS do input principal
    const getInputDisplayClasses = (): string => {
        let classes = styles.inputDisplay; // Classe base
        if (disabled) classes += ` ${styles.disabled}`; // Adiciona classe se desabilitado
        return classes;
    };

    // Determina as classes CSS de cada botão de dia
    const getDayButtonClasses = (calendarDay: CalendarDay): string => {
        let classes = styles.dayButton; // Classe base
        
        if (!calendarDay.day) {
            classes += ` ${styles.empty}`;      // Dia vazio (invisível)
        } else if (calendarDay.isDisabled) {
            classes += ` ${styles.disabled}`;   // Dia desabilitado (cinza)
        } else if (calendarDay.isSelected) {
            classes += ` ${styles.selected}`;   // Dia selecionado (azul)
        } else if (calendarDay.isToday) {
            classes += ` ${styles.today}`;      // Hoje (azul mais escuro)
        } else {
            classes += ` ${styles.available}`;  // Dia normal (clicável)
        }
        
        return classes;
    };

    // Determina as classes CSS do ícone de calendário
    const getCalendarIconClasses = (): string => {
        let classes = styles.calendarIcon; // Classe base
        if (disabled) classes += ` ${styles.disabled}`; // Cinza se desabilitado
        return classes;
    };

    // ========== PARTE 9: RENDER (O QUE APARECE NA TELA) ==========
    return (
        <div className={styles.inputBox}>
            <span className={styles.label}>{dateName}</span>
            <div className={`${styles.container} ${className}`}>
            
                {/* SEÇÃO 1: INPUT DISPLAY - O campo que o usuário vê */}
                <div
                    onClick={handleToggle}           // Abre/fecha quando clica
                    className={getInputDisplayClasses()} // Classes CSS dinâmicas
                >
                    <span className={styles.inputText}>
                        {formatDateForDisplay(value)} {/* "31/08/2025" ou placeholder */}
                    </span>
                    <Calendar className={getCalendarIconClasses()} /> {/* Ícone de calendário */}
                </div>
                {/* SEÇÃO 2: DROPDOWN - O calendário que aparece quando abre */}
                {isOpen && !disabled && ( // Só renderiza se estiver aberto E não desabilitado
                    <div className={styles.dropdown}>
            
                        {/* SUBSEÇÃO 1: HEADER - Navegação de mês/ano */}
                        <div className={styles.header}>
                            {/* Botão mês anterior */}
                            <button
                                type="button"
                                onClick={() => navigateMonth(-1)} // -1 = mês anterior
                                className={styles.navigationButton}
                                aria-label="Mês anterior" // Acessibilidade
                            >
                                <ChevronLeft className={styles.navigationIcon} />
                            </button>
            
                            {/* Título do mês/ano */}
                            <h3 className={styles.monthYear}>
                                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                                {/* Ex: "Agosto 2025" */}
                            </h3>
            
                            {/* Botão próximo mês */}
                            <button
                                type="button"
                                onClick={() => navigateMonth(1)} // +1 = próximo mês
                                className={styles.navigationButton}
                                aria-label="Próximo mês" // Acessibilidade
                            >
                                <ChevronRight className={styles.navigationIcon} />
                            </button>
                        </div>
                        {/* SUBSEÇÃO 2: DIAS DA SEMANA - Cabeçalho do calendário */}
                        <div className={styles.weekDays}>
                            {weekDays.map((day: string) => ( // Para cada dia da semana
                                <div key={day} className={styles.weekDay}>
                                    {day} {/* Dom, Seg, Ter... */}
                                </div>
                            ))}
                        </div>
                        {/* SUBSEÇÃO 3: GRID DE DIAS - O calendário propriamente dito */}
                        <div className={styles.calendarGrid}>
                            {getDaysInMonth(currentMonth).map((calendarDay: CalendarDay, index: number) => {
                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => handleDateClick(calendarDay)} // Seleciona o dia
                                        disabled={!calendarDay.day || calendarDay.isDisabled} // Desabilita se necessário
                                        className={getDayButtonClasses(calendarDay)} // Classes CSS dinâmicas
                                        aria-label={ // Acessibilidade
                                            calendarDay.day
                                                ? `Selecionar dia ${calendarDay.day}`
                                                : undefined
                                        }
                                    >
                                        {calendarDay.day} {/* 1, 2, 3... ou vazio */}
                                    </button>
                                );
                            })}
                        </div>
                        {/* SUBSEÇÃO 4: FOOTER - Botões de ação */}
                        <div className={styles.footer}>
                            <div className={styles.footerLeft}>
                                {/* Botão Cancelar */}
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)} // Apenas fecha, não muda nada
                                    className={`${styles.footerButton} ${styles.cancelButton}`}
                                >
                                    Cancelar
                                </button>
                                {/* Botão Limpar */}
                                <button
                                    type="button"
                                    onClick={handleClearClick} // Limpa a seleção
                                    className={`${styles.footerButton} ${styles.clearButton}`}
                                >
                                    Limpar
                                </button>
                            </div>
                            {/* Botão Hoje */}
                            <button
                                type="button"
                                onClick={handleTodayClick} // Seleciona hoje
                                className={`${styles.footerButton} ${styles.todayButton}`}
                            >
                                Hoje
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ========== PARTE 10: EXPORT ==========
export default CustomDatePicker; // Permite importar como default

// ========== RESUMO DO FLUXO DE FUNCIONAMENTO ==========
/*
1. INICIALIZAÇÃO:
   - Componente recebe props (value, onChange, etc.)
   - Estados são criados (isOpen = false, currentMonth = hoje)

2. RENDER INICIAL:
   - Mostra o input com a data formatada ou placeholder
   - Calendário não aparece (isOpen = false)

3. USUÁRIO CLICA NO INPUT:
   - handleToggle é chamado
   - isOpen vira true
   - Calendário aparece na tela

4. USUÁRIO NAVEGA PELO CALENDÁRIO:
   - Botões < > chamam navigateMonth(-1 ou +1)
   - currentMonth muda
   - getDaysInMonth recalcula os dias
   - Interface atualiza

5. USUÁRIO CLICA EM UM DIA:
   - handleDateClick é chamado
   - Data é formatada ("2025-08-15")
   - onChange é chamado (avisa o componente pai)
   - isOpen vira false (calendário fecha)

6. COMPONENTE PAI RECEBE A DATA:
   - A prop 'value' muda
   - Componente re-renderiza
   - Input mostra a nova data

7. VALIDAÇÕES:
   - minDate/maxDate desabilitam dias inválidos
   - disabled impede interação
   - Dias vazios não são clicáveis
*/