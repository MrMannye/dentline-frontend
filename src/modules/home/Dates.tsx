import React from 'react'
import CardDate from './components/CardDate'

export default function Dates() {
    return (
        <div className='w-full'>
            {[1, 2, 3, 4, 5].map(date => {
                return (
                    <CardDate key={date} name={"Abel Zepeda"} ocupation={"Arquitecto"} date={"8:30 am"} id={date.toString()} />
                )
            })}
        </div>
    )
}
