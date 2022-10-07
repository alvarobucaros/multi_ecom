import axios from 'axios';
import React, { useEffect, useState} from 'react';
import { Button, Modal, ModalFooter, ModalHeader, ModalBody} from "reactstrap"

function TiposForm(props) {

    var   [misDatos] = [{}];
    const [numeroPaginas, setNumeroPaginas] = useState(0);    
    var   totalRegistros = 0;
    const [pagina, setPagina] = useState(0);
    const [registros, setRegistros] = useState([{}]);
    const registrosPorPagina = 6;

    const empresa = props.e;
    const usuario = props.u;
    const nivel = props.n;

    const [Tipos, setTipos]  = useState({  
        id:0,
        tp_idEmpresa:0, 
        tp_codigo:'', 
        tp_descipcion:'', 
        tp_estado:'', 
        tp_usuario:0
    })

    const [TiposW, setTiposW]  = useState({  
      id:0, tp_idEmpresa:empresa, tp_codigo:'', 
      tp_descipcion:'', tp_estado:'A', tp_usuario:0
    })

    var   aviso = '';

    const [modalDel, setModalDel] = React.useState(false);
    const toggle_del = () => setModalDel(!modalDel);
    const [modalPpal, setModalPpal] = React.useState(false);
    const toggle_ppal = () => setModalPpal(!modalPpal);

    const [codBorrado, setCodBorrado] = useState('');
    const [detBorrado, setDetBorrado] = useState('');

    // trae datos de la tabla principal  
    useEffect(()=>{
        traeInfo(empresa)
    },[])

    async function traeInfo(empresa){
        let id = empresa;       
        await  axios.get("http://localhost:3000/api/tipos?e="+empresa+"&op=todos")
        .then(res=>{
            misDatos=res.data; 
        })
            totalRegistros = misDatos.length;
            let numeroPaginas =  Math.ceil(totalRegistros / registrosPorPagina);
            setNumeroPaginas(numeroPaginas);
        await subPartirTabla(pagina);
       
    }   
    //  Paginación
    async function subPartirTabla(pagina){   
            
            var ini = pagina * registrosPorPagina;
            var fin = ini + registrosPorPagina;
            var tempData = []
            if(fin > totalRegistros) {fin = totalRegistros}
            for (var i = ini; i < fin; i++){
                tempData.push( misDatos[i] );
            }
           setRegistros(tempData)
        }


    async function paginar(op){
        // P primera, A anterior, S siguiente, U ultima
alert(pagina)
        let  pg = pagina;
        switch (op) { 
          case 'P':      
            pg = 0
         //     break;      
          case 'A':
            pg -= 1;
            if(pg <0){pg = 0}
        //    break;
          case 'S': 
            pg += 1;
            if(pg > numeroPaginas-1) {pg = (numeroPaginas-1)}
      //      break;
          case 'U':  
            pg = (numeroPaginas - 1);
      //      break;   
        }
   alert(pg);
   setPagina(pg);
   await subPartirTabla(pg);
      }

      function handleShow(rec){
        setDetBorrado(rec.tp_codigo + ' - ' + rec.tp_descipcion);
        setCodBorrado(rec.id)
        setModalDel(!modalDel);
    }

    async function handleShowPpal(rec){
        setTipos(rec)
        setModalPpal(!modalPpal);
    }

    async function ActualizaRegistro () { 
        let err=''
        Tipos.tp_idEmpresa=empresa;

        if(Tipos.tp_codigo ===''){err += ', Código';}
        if(Tipos.tp_descipcion ===''){err += ', Descripción';}

        if (err===''){
            await  axios.post('http://localhost:3000/api/Tipos', Tipos)
            .then( alert('Información actualizada'),()=>{
            })
            traeInfo(empresa)
            setModalPpal(!modalPpal);
        }else{
            aviso = 'Falta '+err;
        }
    }

    async function BorraRegistro(){  
        let id="Tipos|"+codBorrado;
        await  axios.delete('http://localhost:3000/api/generales/'+id)
        .then(res=>{
        })
        traeInfo(empresa)
        setModalDel(!modalDel);
    }

    const handledSubmit = async (e) => {
        e.preventDefault();
        aviso = '';
    }
  
    const handledChange = ({target: {name, value}}) => {
        setTipos({...Tipos, [name]: value});
    }

    return (
    <div>
        <div>
            <table   className='miTable'>
                <thead>  
                    <tr key={0}>
                        <th className="">Código</th>                            
                        <th className="">Descripción</th>
                        <th className="">Usuario</th>
                        <th className="">Estado</th>                             
                        <th colSpan='2'>Comandos</th>
                    </tr>
                </thead>
                <tbody> 
            
                {registros.map((rec, key) =>                
                    <tr key={rec.id}>
                        <td className="trc">{rec.tp_codigo}</td>
                        <td className="trl">{rec.tp_descipcion}</td>
                        <td className="trc">{rec.tp_usuario}</td>
                        <td className="trc">{rec.us_estado}</td>
                        <td className="trc"><button onClick={() => handleShowPpal(rec)} className='btn btn-sm btn-primary '>Edita</button></td>
                        <td className="trc"><button onClick={() => handleShow(rec)} className='btn btn-sm btn-danger '>Anula</button></td>
                    </tr>    
                )}
                </tbody>
            </table> 
            <div className='botones'>
                <div>
                    <button onClick={() => paginar('P')} className='boton btn'> |&#8612; </button>
                    <button onClick={() => paginar('A')} className='boton btn'> &larr; </button>
                    <button onClick={() => paginar('S')} className='boton btn'> &rarr; </button>
                    <button onClick={() => paginar('U')} className='boton btn'> &#8614;| </button>
                    <button onClick={() => handleShowPpal(TiposW)} className='btn btn-sm btn-primary '>Nuevo registro</button>        
                </div>
                <div>
                    <span>Página {pagina+1} de {numeroPaginas}  
                        Total Registros = {totalRegistros},  Registros Por Pagina = {registrosPorPagina}                   
                    </span>
                </div>

                <div className='modal1'>    
                    <Modal isOpen={modalDel} toggle_del={toggle_del}>
                    <ModalHeader  toggle_del={toggle_del}>Borra el registro {codBorrado}</ModalHeader>
                        <ModalBody>
                        <span> {detBorrado} </span>
                        <div>
                            <Button color="primary" onClick={toggle_del}>NO</Button>
                            <Button color="primary" onClick={BorraRegistro}>SI</Button>
                        </div>
                        </ModalBody>
                    </Modal>
                </div>

                <div className='modal1'>    
                    <Modal isOpen={modalPpal} toggle_ppal={toggle_ppal}>
                    <ModalHeader  toggle_ppal={toggle_ppal}>Actualiza información</ModalHeader>
                        <ModalBody>
                        <div className='container'>
                            <form onSubmit={handledSubmit}>
                                <div className="mb-1 row">
                                    <label className="col-sm-3 col-form-label" htmlFor="tp_codigo">Código</label>
                                    <div className="col-sm-9">
                                    <input type="text" className="form-control" name='tp_codigo' id="tp_codigo" 
                                        defaultValue={Tipos.tp_codigo} onChange={handledChange}  required/> 
                                    </div>
                                </div>
                                <div className="mb-1 row">
                                    <label className="col-sm-3 col-form-label" htmlFor="tp_descipcion">Descipción</label>
                                    <div className="col-sm-9">
                                    <input type="text" className="form-control" name='tp_descipcion' id="tp_descipcion" 
                                        defaultValue={Tipos.tp_descipcion} onChange={handledChange}  required/> 
                                    </div>                                    
                                </div>                                                                
                                                  
                                <div className="mb-1 row">
                                    <label className="col-sm-3 col-form-label" htmlFor="tp_estado">Estado</label>
                                    <div className="col-sm-9">
                                        <input type="radio" value="A" name='tp_estado'
                                        defaultValue={Tipos.tp_estado} onChange={handledChange}
                                        checked={Tipos.tp_estado === "A"}/> Activo
                                        <input type="radio" value="I" name='tp_estado'
                                        defaultValue={Tipos.tp_estado} onChange={handledChange}
                                        checked={Tipos.tp_estado === "I"}/> Inactivo
                                    </div>
                                </div>                                                                                                               
                            </form>
                            <span  className='alert'>{aviso}</span>
                        </div>
                        <ModalFooter>
                            <Button color="primary" onClick={toggle_ppal}>Ignora</Button>
                            <Button color="primary" onClick={ActualizaRegistro}>Actualiza</Button>
                        </ModalFooter>
                        </ModalBody>
                    </Modal>
                </div>        
            </div>    
        </div>
    </div>
  
    )
  }
  
  export default TiposForm
