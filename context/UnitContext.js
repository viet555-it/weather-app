import React, { createContext, useContext, useState } from 'react';

const UnitContext = createContext();

export function UnitProvider({ children }) {
    const [unit, setUnit] = useState('C');

    const toggleUnit = () => {
        setUnit(prev => prev === 'C' ? 'F' : 'C');
    };

    const formatTemp = (celsius) => {
        if (celsius === null || celsius === undefined) return '--';
        const value = unit === 'C' ? celsius : (celsius * 1.8 + 32);
        return Math.round(value);
    };

    return (
        <UnitContext.Provider value={{ unit, toggleUnit, formatTemp }}>
            {children}
        </UnitContext.Provider>
    );
}

export function useUnit() {
    const context = useContext(UnitContext);
    if (!context) {
        throw new Error('useUnit must be used within a UnitProvider');
    }
    return context;
}
