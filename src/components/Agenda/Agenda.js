import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
//import AgendaMonth from './AgendaMonth';
import Api from '../Api';
import SelectYear from '../SelectYear/SelectYear';
import FullCalendar, { CalendarApi, CalendarDataManager, formatDate } from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import frLocale from '@fullcalendar/core/locales/fr';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; 
import Form from 'react-bootstrap/Form'
import { useNavigate } from "react-router";

export default function Agenda({user}) {
    const [events, setEvents] = useState([]);
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
    const [isMobile, setIsMobile] = useState('');
    const months = [
        'Janvier',
        'Fevrier',
        'Mars',
        'Avril',
        'Mai',
        'Juin',
        'Juillet',
        'Aout',
        'Septembre',
        'Octobre',
        'Novembre',
        'Décembre'
    ]

    const monthsOption = [];

    months.map((month, index) => monthsOption.push(<option value={index + 1} key={index} selected={index + 1 === new Date().getMonth() + 1}>{month}</option>))
    

    const calendarRef = useRef();

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
    
    const changeView = view => {
        const API = getApi();
        API && API.changeView(view)
    }

    const getApi = () => {
        const { current: calendarDom } = calendarRef;
        return calendarDom ? calendarDom.getApi() : null;
    }

    const onYearChange = (year) => {
        const API = getApi();
        const month = API && API.getDate().getMonth();
        const date = API && new Date(`${year}-${month+1}`);
        API && API.gotoDate(date)
    }

    const onMonthChange = (month, year) => {
        const API = getApi();
        const date = API && new Date(`${year}-${month}`);
        API && API.gotoDate(date)
    }

    useEffect(() => {
        currentIdUser !== null && getEvents()
        
        const resizeListener = () => {
            changeView(window.innerWidth < 960 ? 'listMonth' : 'dayGridMonth')
        }

        window.addEventListener('resize', resizeListener);
    
        return () => {
            window.removeEventListener('resize', resizeListener);
        }
        
    }, [currentIdUser, year])
    
    let navigate = useNavigate()
    const test = (info) => {
        navigate(`/event-list/add?start=${info.startStr}&end=${info.endStr}`)
    }
    return (
    <>  
        <h1>Agenda</h1>
        <SelectYear year={setYear, onYearChange} lastestYear={2018}/>
        <Form.Select onChange={(e) => onMonthChange(e.target.value, year)}>
            {monthsOption}
        </Form.Select>
        <FullCalendar
            locale={frLocale}
            plugins={[listPlugin, dayGridPlugin, interactionPlugin]}
            initialView={isMobile}
            events={events}
            headerToolbar={{
                left: "prev,next",
                center: "title",
                right: "dayGridMonth,listMonth"
            }}
            ref={calendarRef}
            selectable={true}
            select={test}
        />
    </>
    )
}