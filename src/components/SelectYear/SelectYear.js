import React, { useEffect, useState } from 'react';
import Api from '../Api';
import Form from 'react-bootstrap/Form'
import 'bootstrap/dist/css/bootstrap.min.css';

export default function SelectYear(props) {
    let currentYear = new Date().getFullYear() + 1;
    const dateOptions = [];

    while (currentYear >= props.lastestYear) {
        dateOptions.push(<option value={currentYear} selected={currentYear === new Date().getFullYear()}>{currentYear}</option>)
        currentYear -= 1;
    }

    return (

        <Form.Select onChange={(e) => props.year(e.target.value)}>
            {dateOptions}
        </Form.Select>
    )
}