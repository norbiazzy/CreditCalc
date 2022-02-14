import React, {FC} from 'react';

interface CreditProps {
    type: string, // тип кредита
    ann?: number, // постоянны месячный платеж
    min?: number, // минимальный месячный платеж
    max?: number, // максимальный месячный платеж
    percentOverpayment: number, // переплата %
    allSum: number, // общая сумма выплат
    overpaymentSum: number // общая сумма переплат
    cell: string
}

const Result: ({
                   type,
                   ann,
                   min,
                   max,
                   percentOverpayment,
                   allSum,
                   overpaymentSum,
                   cell
               }: CreditProps) => JSX.Element = ({
                                                     type,
                                                     ann,
                                                     min,
                                                     max,
                                                     percentOverpayment,
                                                     allSum,
                                                     overpaymentSum,
                                                     cell
                                                 }) => {
    return (
        <div>
            <h2>Расчет кредита</h2>
            <ul className='sum__list'>
                {type === 'ann'
                    ? (
                        <li className='sum__item'>
                            <p>Ежемесячный платеж</p>
                            <span className='sum__val'>{ann?.toFixed(2)}</span>
                        </li>)
                    : (<>
                        <li className='sum__item'>
                            <p>Минимальный месячный платеж</p>
                            <span className='sum__val'>{min?.toFixed(2)}</span>
                        </li>
                        <li className='sum__item'>
                            <p>Максимальный месячный платеж</p>
                            <span className='sum__val'>{max?.toFixed(2)}</span>
                        </li>
                    </>)}
                <li className='sum__item'>
                    <p>Сумма кредита</p>
                    <span className='sum__val'>{cell}</span>
                </li>
                <li className='sum__item'>
                    <p>Переплата</p>
                    <span className='sum__val'>{overpaymentSum}</span>
                </li>
                <li className='sum__item'>
                    <p>Общая сумма выплат </p>
                    <span className='sum__val'>{allSum}</span>
                </li>
                <li className='sum__item'>
                    <p>Процент переплат</p>
                    <span className='sum__val'>{percentOverpayment}</span>
                </li>
            </ul>
            <button>Показать расчет по месяцам</button>
        </div>
    );
};

export default Result;
