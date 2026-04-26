import { useState, useCallback, memo } from 'react';

const formatRupiah = (value) => {
    if (!value && value !== 0) return '';
    const num = Math.round(parseFloat(value));
    if (isNaN(num) || num === 0) return '';
    return new Intl.NumberFormat('id-ID').format(num);
};

const CurrencyInput = memo(function CurrencyInput({ value, onChange, className = '', placeholder = '0' }) {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = useCallback((e) => {
        setIsFocused(true);
        setTimeout(() => e.target.select(), 0);
    }, []);

    const handleBlur = useCallback(() => {
        setIsFocused(false);
    }, []);

    const handleChange = useCallback((e) => {
        const raw = e.target.value.replace(/[^0-9]/g, '');
        onChange(raw);
    }, [onChange]);

    const displayValue = isFocused
        ? (value || '')
        : formatRupiah(value);

    return (
        <input
            type="text"
            inputMode="numeric"
            value={displayValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={className}
            placeholder={placeholder}
        />
    );
});

export default CurrencyInput;
