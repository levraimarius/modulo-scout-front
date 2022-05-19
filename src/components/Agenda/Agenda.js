import React, { useEffect, useState } from 'react';
//import AgendaMonth from './AgendaMonth';
import Api from '../Api';
import SelectYear from '../SelectYear/SelectYear';
import FullCalendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import frLocale from '@fullcalendar/core/locales/fr';

export default function Agenda() {
    const [events, setEvents] = useState([]);
    const [months, setMonths] = useState(null);
    const [year, setYear] = useState(new Date().getFullYear());
    const currentMonth = useState(new Date().getMonth());
    const currentScope = JSON.parse(localStorage.getItem('currentScope'));
    const currentStructure = currentScope[0][0];

    const getEvents = () => {
        Api.get(`/structures?id=${currentStructure}&pagination=false`)
        .then(res => {
            const data = res.data
            const arrayEvents = []

            data.map(structure => {
                arrayEvents.push(...structure.events)
            })

            setEvents([...arrayEvents])
        })
        Api.get(`/structures?parentStructure=${currentStructure}&pagination=false`)
        .then(res => {
            const data = res.data
            const arrayEvents = []

            data.map(structure => {
                structure.events !== null && arrayEvents.push(...structure.events)
            })

            events !== [] && arrayEvents.length !== 0 && setEvents([...events, ...arrayEvents])
            events === [] && arrayEvents.length !== 0 && setEvents([...arrayEvents])
        })
    }

    useEffect(() => {
        getEvents()

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