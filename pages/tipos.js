import React from 'react'
import Foot from '../components/footer'
import Menu from '../components/Menu'
import TipoForm from '../components/TipoForm'
import { useRouter } from 'next/router'

export default function tipos() {
  const router = useRouter()
 
  const e = router.query.e;
  const u = router.query.u;
  const n = router.query.n;

  return (
    <div className='mi-container'>
        <div className="item item-head"><Menu titulo='Tipos de productos'/></div>
        <div className="item item-body">
         <TipoForm e={e} u={u} n={n}/> 
        </div>
        <div className="item item-foot"><Foot/></div>
    </div>

    
  )
}
