import React from 'react';
import TableRow from "./TableRow";

const Table = () => {
    return (
        <table>
            <thead>
            <tr>
                <th>#</th>
                <th>Дата расчета</th>
                <th>Остаток кредита</th>
                <th>Платеж по %</th>
                <th>Погашение осн. долга</th>
                <th>Сумма платежа</th>
            </tr>
            </thead>
            <tbody>
            <TableRow/>
            </tbody>
        </table>
    );
};

export default Table;
