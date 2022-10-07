// import {useLocalStorage} from './useLocalStorage'
import React, {useState} from 'react'

function Global(props) {
    const [glbDatos, setGlbDatos] = useState({empId:'', 
    user:'',nivel:'',nomEm:'',nomUs:'',stado:'', show:false})
    glbDatos.empId=props.empId;
    glbDatos.user=props.user;
    glbDatos.nivel=props.nivel;
    glbDatos.nomEm=props.nomEm;
    glbDatos.nomUs=props.nomUs;
    glbDatos.stado=props.stado;
    glbDatos.show=props.show;
  };


export default Global;
