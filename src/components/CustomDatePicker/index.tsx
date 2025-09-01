import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import styles from './CustomDatePicker.module.css';

// ========== INTERFACES E TIPOS ==========
interface CustomDatePickerProps {
    value: string;
    onChange: (date: string) => void;
    placeholder?: string;
    disabled?: boolean;
    minDate?: string;
    maxDate?: string;
}

interface CalendarDay {
    day: number | null;
    isCurrentMonth: boolean;
    isSelected: boolean;
    isToday: boolean;
    isDisabled: boolean;
}

// ========== COMPONENTE PRINCIPAL ==========
export function CustomDatePicker({
    value,
    onChange,
    placeholder = "Selecione a data",
    disabled = false,
    minDate,
    maxDate,

    }: CustomDatePickerProps) {
        const [isOpen, setIsOpen] = useState<boolean>(false);
        const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

    // ========== FUNÇÕES UTILITÁRIAS ==========
    const formatDateForDisplay = (dateString: string): string => {
        if (!dateString) return placeholder;
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };

    const isDateDisabled = (date: Date): boolean => {
        const dateString = date.toISOString().split('T')[0];
        
        // Ocorre não por conta da data, mas por ordem alfabética e numérica
        if (minDate && dateString < minDate) return true;
        if (maxDate && dateString > maxDate) return true;
        
        return false;
    };

    const isToday = (date: Date): boolean => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const getDaysInMonth = (date: Date): CalendarDay[] => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days: CalendarDay[] = [];
        
        // Dias vazios no início
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push({
                day: null,
                isCurrentMonth: false,
                isSelected: false,
                isToday: false,
                isDisabled: true
            });
        }
        
        // Dias do mês
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(year, month, day);
            const dateString = currentDate.toISOString().split('T')[0];
            
            days.push({
                day,
                isCurrentMonth: true,
                isSelected: value === dateString,
                isToday: isToday(currentDate),
                isDisabled: isDateDisabled(currentDate)
            });
        }
        
        return days;
    };

    // ========== HANDLERS ==========
    const handleDateClick = (calendarDay: CalendarDay): void => {
        if (!calendarDay.day || calendarDay.isDisabled) return;
        
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const selectedDate = new Date(year, month, calendarDay.day);
        const formattedDate = selectedDate.toISOString().split('T')[0];
        
        onChange(formattedDate);
        setIsOpen(false);
    };

    const navigateMonth = (direction: -1 | 1): void => {
        const newMonth = new Date(currentMonth);
        newMonth.setMonth(currentMonth.getMonth() + direction);
        setCurrentMonth(newMonth);
    };

    const handleTodayClick = (): void => {
        const today = new Date().toISOString().split('T')[0];
        onChange(today);
        setIsOpen(false);
    };

    const handleClearClick = (): void => {
        onChange('');
        setIsOpen(false);
    };

    const handleToggle = (): void => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };

    // ========== CONSTANTES ==========
    const monthNames: string[] = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const weekDays: string[] = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    // ========== CLASSES DINÂMICAS ==========
    const getInputDisplayClasses = (): string => {
        let classes = styles.inputDisplay;
        if (disabled) classes += ` ${styles.disabled}`;
        return classes;
    };

    const getDayButtonClasses = (calendarDay: CalendarDay): string => {
        let classes = styles.dayButton;
        
        if (!calendarDay.day) {
            classes += ` ${styles.empty}`;
        } else if (calendarDay.isDisabled) {
            classes += ` ${styles.disabled}`;
        } else if (calendarDay.isSelected) {
            classes += ` ${styles.selected}`;
        } else if (calendarDay.isToday) {
            classes += ` ${styles.today}`;
        } else {
            classes += ` ${styles.available}`;
        }
        
        return classes;
    };

    const getCalendarIconClasses = (): string => {
        let classes = styles.calendarIcon;
        if (disabled) classes += ` ${styles.disabled}`;
        return classes;
    };

    // ========== RENDER ==========
    return (
        <div className={`${styles.container}`}>
            {/* Input Display */}
            <div 
                onClick={handleToggle}
                className={getInputDisplayClasses()}
            >
                <span className={styles.inputText}>
                    {formatDateForDisplay(value)}
                </span>
                <Calendar className={getCalendarIconClasses()} />
            </div>

            {/* Calendar Dropdown */}
            {isOpen && !disabled && (
                <div className={styles.dropdown}>
                    {/* Header */}
                    <div className={styles.header}>
                        <button 
                            type="button"
                            onClick={() => navigateMonth(-1)}
                            className={styles.navigationButton}
                            aria-label="Mês anterior"
                        >
                            <ChevronLeft className={styles.navigationIcon} />
                        </button>
                        
                        <h3 className={styles.monthYear}>
                            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                        </h3>
                        
                        <button 
                            type="button"
                            onClick={() => navigateMonth(1)}
                            className={styles.navigationButton}
                            aria-label="Próximo mês"
                        >
                            <ChevronRight className={styles.navigationIcon} />
                        </button>
                    </div>

                    {/* Week Days */}
                    <div className={styles.weekDays}>
                        {weekDays.map((day: string) => (
                            <div key={day} className={styles.weekDay}>
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Days */}
                    <div className={styles.calendarGrid}>
                        {getDaysInMonth(currentMonth).map((calendarDay: CalendarDay, index: number) => {
                            return (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => handleDateClick(calendarDay)}
                                    disabled={!calendarDay.day || calendarDay.isDisabled}
                                    className={getDayButtonClasses(calendarDay)}
                                    aria-label={
                                        calendarDay.day 
                                            ? `Selecionar dia ${calendarDay.day}`
                                            : undefined
                                    }
                                >
                                    {calendarDay.day}
                                </button>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <div className={styles.footer}>
                        <div className={styles.footerLeft}>
                            <button 
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className={`${styles.footerButton} ${styles.cancelButton}`}
                            >
                                Cancelar
                            </button>
                            <button 
                                type="button"
                                onClick={handleClearClick}
                                className={`${styles.footerButton} ${styles.clearButton}`}
                            >
                                Limpar
                            </button>
                        </div>
                        <button 
                            type="button"
                            onClick={handleTodayClick}
                            className={`${styles.footerButton} ${styles.todayButton}`}
                        >
                            Hoje
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CustomDatePicker;