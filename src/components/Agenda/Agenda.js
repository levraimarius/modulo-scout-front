import React, { useEffect, useState } from 'react';
//import AgendaMonth from './AgendaMonth';
import Api from '../Api';
import SelectYear from '../SelectYear/SelectYear';
import FullCalendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import frLocale from '@fullcalendar/core/locales/fr';

export default function Agenda({user}) {
    const [events, setEvents] = useState([]);
    const [months, setMonths] = useState(null);
    const [year, setYear] = useState(new Date().getFullYear());
    const currentMonth = useState(new Date().getMonth());
    const currentScope = JSON.parse(localStorage.getItem('currentScope'));
    const currentStructure = currentScope[0][0];
    const currentFunction = currentScope[1][0];
    const currentIdUser = user !== null ? user.id : null;

    const deleteDuplicates = (array) => {
        const setArray = new Set(array)
        const uniqueArray = Array.from(setArray)
        
        return uniqueArray
    }

    const getEvents = () => {
        // Evènements liés à la structure de mon scope
        Api.get(`/structures?id=${currentStructure}&pagination=false`)
        .then(res => {
            const data = res.data
            const arrayEvents = []

            data.map(structure => {
                arrayEvents.push(...structure.events)

                structure.parentStructure.events.map(event => {
                    // Evènements liés à la structure parente et où ma fonction est invitée
                    event.invitedRoles.map(roles => {
                        roles.id === currentFunction && arrayEvents.push(event)
                    })

                    // Evènements liés à la structure parente et où je suis nominativement invité
                    event.invitedPersons.map(person => {
                        person.id === currentIdUser && arrayEvents.push(event)
                    })

                    event.isVisible && arrayEvents.push(event)
                })
            })

            // Evènements liés aux structures enfants de ma structure actuelle
            Api.get(`/structures?parentStructure=${currentStructure}&pagination=false`)
            .then(res => {
                const data = res.data

                data.map(structure => {
                    structure.events.map(event => {
                        arrayEvents.push(event)
                    })
                })

                setEvents([...deleteDuplicates(arrayEvents)])
            })

            setEvents([...events, ...deleteDuplicates(arrayEvents)])
        })
    }

    useEffect(() => {
        currentIdUser !== null && getEvents()

        setMonths(['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juiller', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre'])
        
    }, [currentIdUser])

    return (
    <>  
        <h1>Agenda</h1>
        <SelectYear year={setYear} lastestYear={2018}></SelectYear>
        <FullCalendar locale={frLocale} plugins={[listPlugin]} initialView="listMonth" events={events}></FullCalendar>
    </>
    )
}