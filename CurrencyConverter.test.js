import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CurrencyConverter from './CurrencyConverter';
import axios from 'axios';

// Мокаем axios
jest.mock('axios');

describe('CurrencyConverter', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders the component', () => {
        render(<CurrencyConverter />);
        expect(screen.getByText(/Конвертер валют/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/15 USD in RUB/i)).toBeInTheDocument();
    });

    test('converts currency correctly', async () => {
        // Мокаем ответ от API
        axios.get.mockResolvedValueOnce({
            data: {
                rates: {
                    RUB: 1,
                    USD: 63.49,
                },
            },
        });

        render(<CurrencyConverter />);
        
        fireEvent.change(screen.getByPlaceholderText(/15 USD in RUB/i), {
            target: { value: '15 USD in RUB' },
        });
        fireEvent.click(screen.getByText(/Конвертировать/i));

        await waitFor(() => {
            expect(screen.getByText(/Результат: 952.35/i)).toBeInTheDocument();
        });
    });

    test('shows error for invalid input format', async () => {
        render(<CurrencyConverter />);
        
        fireEvent.change(screen.getByPlaceholderText(/15 USD in RUB/i), {
            target: { value: 'invalid input' },
        });
        fireEvent.click(screen.getByText(/Конвертировать/i));

        expect(await screen.findByText(/Неверный формат ввода/i)).toBeInTheDocument();
    });

    test('shows error for unsupported currency', async () => {
        // Мокаем ответ от API с отсутствующей валютой
        axios.get.mockResolvedValueOnce({
            data: {
                rates: {
                    RUB: 1,
                },
            },
        });

        render(<CurrencyConverter />);
        
        fireEvent.change(screen.getByPlaceholderText(/15 USD in RUB/i), {
            target: { value: '15 USD in EUR' },
        });
        fireEvent.click(screen.getByText(/Конвертировать/i));

        expect(await screen.findByText(/Неверная валюта/i)).toBeInTheDocument();
    });

    test('shows error when API call fails', async () => {
        // Мокаем ошибку API
        axios.get.mockRejectedValueOnce(new Error('Network Error'));

        render(<CurrencyConverter />);
        
        fireEvent.change(screen.getByPlaceholderText(/15 USD in RUB/i), {
            target: { value: '15 USD in RUB' },
        });
        fireEvent.click(screen.getByText(/Конвертировать/i));

        expect(await screen.findByText(/Ошибка при получении данных/i)).toBeInTheDocument();
    });
});