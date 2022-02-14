import React, {useEffect, useState, FC, ChangeEvent} from 'react';
import Result from "./Result";

const PERCENT_POINT = 5

interface CreditData {
    remainSum: number; // Выплата в месяц
    percents: number; // Процент в этом месяце
    dif: number; // основной долг за месяц
    mainDebt: number; // остаток суммы
}


interface Credit {
    type: string, // тип кредита
    ann: number, // постоянны месячный платеж
    min: number, // минимальный месячный платеж
    max: number, // максимальный месячный платеж
    percentOverpayment: number, // переплата %
    allSum: number, // общая сумма выплат
    overpaymentSum: number, // общая сумма переплат
    data: CreditData[]
}

interface RefinancingRate {
    Data: string,
    Value: string
}

const Calc: FC = () => {
    const [cell, setCell] = useState<string>('1000.00')
    const [rate, setRate] = useState<string>('0.00')
    const [period, setPeriod] = useState<string>('12')
    const [credit, setCredit] = useState<Credit>({
        allSum: 0,
        ann: 0,
        data: [],
        max: 0,
        min: 0,
        overpaymentSum: 0,
        percentOverpayment: 0,
        type: "ann"
    })

    const setValCell = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCell(ps => isNaN(+e.target.value) ? ps : e.target.value)
    }
    const setValPeriod = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRate(ps => isNaN(+e.target.value) ? ps : e.target.value)
    }
    const getRefinancingRate = async () => {
        let date = new Date
        let res: Response = await fetch(`https://www.nbrb.by/api/refinancingrate?ondate=${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`)
        let data: [RefinancingRate] = await res.json()
        setRate(data[0].Value + PERCENT_POINT)
    }

    useEffect(() => {
        getRefinancingRate()
    }, [])

    useEffect(() => {
        if (credit.type === 'ann') calcAnnCredit()
        else if (credit.type === 'def') calcDefCredit()
    }, [rate, cell, period, credit.type])

    const calcAnnCredit = () => {
        let monthRate = +rate / 100 / 12 // месячная ставка
        let ann = (+cell * (monthRate * (1 + monthRate) ** +period) / ((1 + monthRate) ** +period - 1)) // полная сумма
        let sumOverpayment = +(+period * ann - +cell).toFixed(2)

        setCredit(ps => ({
            ...ps,
            ann: ann,
            allSum: ann * +period,
            overpaymentSum: sumOverpayment,
            percentOverpayment: sumOverpayment / +cell * 100
        }))
    }

    const calcDefCredit = () => {
        let monthRate = +rate / 100 / 12 // месячная ставка
        let dif = 0 // считает сумму
        let remainSum = +cell // остаток платежа
        let mainDebt = +(+cell / +period).toFixed(2) // основной долг
        let percents = 0
        let data: CreditData[] = []
        let allSum = 0
        for (let i = 0; i < +period + 1; i++) {
            let obj = {remainSum, percents, mainDebt, dif}
            obj.remainSum = +remainSum.toFixed(2)
            percents = remainSum * monthRate // проценты по платежам
            obj.percents = +percents.toFixed(2) // Проценты
            remainSum -= mainDebt
            dif = percents + mainDebt
            obj.mainDebt = +mainDebt.toFixed(2) // Основной долг
            allSum += dif
            obj.dif = +dif.toFixed(2) // Ежемесячный платеж
            data.push(obj)
        }
        let overpaymentSum = -(+cell - allSum).toFixed(2)
        let percentOverpayment = +((overpaymentSum / +cell)*100).toFixed(2)
        setCredit(ps => ({
            ...ps,
            data,
            percentOverpayment,
            max: data[1].dif,
            min: data[data.length - 1].dif,
            allSum: +allSum.toFixed(2),
            overpaymentSum
        }))
        console.log(data)
    }
    const BlurForm = () => {
        setCell(ps => (+ps).toFixed(2))
        setRate(ps => (+ps).toFixed(2))
    }

    return (
        <div className='wrapper'>
            <div className='calc__wrapper'>
                <div>
                    <form onBlur={BlurForm}>
                        <div>
                            <p>Сумма кредита</p>
                            <input className={'input'} type='text' value={cell} onChange={setValCell}/>
                        </div>
                        <div>
                            <div>
                                <p>Выберете длительность кредита</p>
                                <select className='input' value={period} onChange={(e) => {
                                    setPeriod(e.target.value)
                                }}>
                                    <option value={'1'}>1 месяц</option>
                                    <option value={'3'}>3 месяца</option>
                                    <option value={'6'}>6 месяцев</option>
                                    <option value={'12'}>1 год</option>
                                    <option value={'24'}>2 года</option>
                                    <option value={'60'}>5 лет</option>
                                </select>
                            </div>
                            <div>
                                <p>Процентная ставка</p>
                                <input type='text' className={'input'} value={rate} onChange={setValPeriod}/>
                            </div>
                        </div>
                        <div>
                            <button type='button' disabled={credit.type==='ann'} onClick={() => {
                                setCredit(ps => ({...ps, type: 'ann'}))
                            }}>ann
                            </button>
                            <button type='button' disabled={credit.type==='def'} onClick={() => {
                                setCredit(ps => ({...ps, type: 'def'}))
                            }}>def
                            </button>
                        </div>
                    </form>
                </div>
                <Result {...credit} cell={cell}/>
            </div>
        </div>

    );
};

export default Calc;
