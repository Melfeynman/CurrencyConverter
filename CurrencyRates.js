import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CurrencyRates = () => {
    const [rates, setRates] = useState({});
    const [baseCurrency, setBaseCurrency] = useState('RUB');

    const fetchRates = async () => {
        try {
            const response = await axios.get(`https://api.exchangeratesapi.io/v1/latest?access_key=YOUR_API_KEY&base=${baseCurrency}`);
            setRates(response.data.rates);
        } catch (error) {
            console.error('Ошибка при получении курсов валют', error);
        }
    };

    useEffect(() => {
        fetchRates();
    }, [baseCurrency]);

    return (
        <div>
            <h2>Текущие курсы валют</h2>
            <select onChange={(e) => setBaseCurrency(e.target.value)} value={baseCurrency}>
                <option value="RUB">RUB</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                {/* Добавьте другие валюты по желанию */}
            </select>
            <ul>
                {Object.entries(rates).map(([currency, rate]) => (
                    <li key={currency}>
                        1 {baseCurrency} = {rate.toFixed(2)} {currency}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CurrencyRates;