import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Api from './Api';

export const isAccredited = (value) => {
  const currentScope = JSON.parse(localStorage.getItem('currentScope'));
  const currentRole = currentScope[1][0];

  return Api.get(`/roles/${currentRole}`).then(response => response.data.accreditations.map(accreditation => accreditation.id).includes(value))
}

