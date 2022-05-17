import React, { useEffect, useState } from 'react';
import AgendaMonth from './AgendaMonth';
import Api from '../Api';
import SelectYear from '../SelectYear/SelectYear';
import FullCalendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import frLocale from '@fullcalendar/core/locales/fr';

export default function Agenda() {
    const [events, setEvents] = useState(null);
    const [months, setMonths] = useState(null);
    const [year, setYear] = useState(new Date().getFullYear());
    const currentMonth = useState(new Date().getMonth());

    useEffect(() => {
        Api.get(`/events`)
        .then((response) => {
            setEvents(response.data);
        })

        setMonths(['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juiller', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre'])
        
    }, [])


    return (
    <>  
        <h1>Agenda</h1>
        <SelectYear year={setYear} lastestYear={2018}></SelectYear>
        <FullCalendar locale={frLocale} plugins={[listPlugin]} initialView="listMonth" events={events}></FullCalendar>
    </>
    )
}