import axios from 'axios';
import React, { useEffect, useState} from 'react';
import { Button, Modal, ModalFooter, ModalHeader, ModalBody} from "reactstrap"
import md5 from 'js-md5'

function UsuariosForm(props) {

    var   [misDatos] = [{}];
    const [numeroPaginas, setNumeroPaginas] = useState(0);    
    var   totalRegistros = 0;
    const [pagina, setPagina] = useState(0);
    const [registros, setRegistros] = useState([{}]);
    const registrosPorPagina = 6;

    const empresa = props.e;
    const usuario = props.u;
    const nivel = props.n

    const [usuarios, setUsuarios]  = useState({  
        id:0,
        us_idEmpresa:0, 
        us_nombre:'', us_direccion:'', 
        us_localidad:'', 
        us_barrio:'', 
        us_ciudad:'', 
        us_email:'', 
        us_codigo:'', 
        us_tipoDoc:'', 
        us_nroDoc:'', 
        us_telefono:'', 
        us_clave:'', 
        us_estado:'', 
        us_nivel:''
    })

    const [usuariosW, setUsuariosW]  = useState({  
      id:0, us_idEmpresa:empresa, us_nombre:'', us_direccion:'', 
      us_localidad:'', us_barrio:'',  us_ciudad:'', us_email:'', 
      us_codigo:'',  us_tipoDoc:'C', us_nroDoc:'',  us_telefono:'', 
      us_clave:'',  us_estado:'A',  us_nivel:'C'
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
        await  axios.get('http://localhost:3000/api/usuarios/'+id)
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
        setDetBorrado(rec.us_nombre + ' - ' + rec.us_email);
        setCodBorrado(rec.id)
        setModalDel(!modalDel);
    }
   
    async function handleShowPpal(rec){
        setUsuarios(rec)
        setModalPpal(!modalPpal);
    }

    async function ActualizaRegistro () { 
        let err=''
        usuarios.us_idEmpresa=empresa;
        if(usuarios.id == 0){
            usuarios.us_clave = md5(usuarios.us_nroDoc);
        }
        if(usuarios.us_nombre ===''){err += ', Nombre';}
        if(usuarios.us_email ===''){err += ', Correo';}
        if(usuarios.us_nroDoc ===''){err += ', Nro documento';}
        if(usuarios.us_telefono ===''){err += ', Teléfono';}
        if(usuarios.us_direccion ===''){err += ', Dirección';}
        if (err===''){
            await  axios.post('http://localhost:3000/api/usuarios', usuarios)
            .then( alert('Información actualizada'),()=>{
            })
            traeInfo(empresa)
            setModalPpal(!modalPpal);
        }else{
            aviso = 'Falta '+err;
        }
    }
    
    async function BorraRegistro(){  
        let id="usuarios|"+codBorrado;
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
        setUsuarios({...usuarios, [name]: value});
    }

    return (
    <div>
        <div>
            <table   className='miTable'>
                <thead>  
                    <tr key={0}>
                        <th className="">Nombre</th>                            
                        <th className="">Direccion</th>
                        <th className="">Ciudad</th>
                        <th className="">Correo</th>
                        <th className="">tp Doc </th>   
                        <th className="">Nro Doc </th>
                        <th className="">Teléfono</th> 
                        <th className="">Código</th> 
                        <th className="">Nivel</th>  
                        <th className="">Estado</th>                             
                        <th colSpan='2'>Comandos</th>
                    </tr>
                </thead>
                <tbody> 

               
                {registros.map((rec, key) =>                
                    <tr key={rec.id}>
                        <td className="trc">{rec.us_nombre}</td>
                        <td className="trl">{rec.us_direccion}</td>
                        <td className="trc">{rec.us_ciudad}</td>
                        <td className="trc">{rec.us_email}</td>
                        <td className="trr">{rec.us_tipoDoc}</td>
                        <td className="trr">{rec.us_nroDoc}</td>
                        <td className="trc">{rec.us_telefono}</td>
                        <td className="trc">{rec.us_codigo}</td>
                        <td className="trc">{rec.us_nivel}</td>
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
                    <button onClick={() => handleShowPpal(usuariosW)} className='btn btn-sm btn-primary '>Nuevo registro</button>        
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
                                    <label className="col-sm-3 col-form-label" htmlFor="us_nombre">Nombre</label>
                                    <div className="col-sm-9">
                                    <input type="text" className="form-control" name='us_nombre' id="us_nombre" 
                                        defaultValue={usuarios.us_nombre} onChange={handledChange}  required/> 
                                    </div>
                                </div>
                                <div className="mb-1 row">
                                    <label className="col-sm-3 col-form-label" htmlFor="us_direccion">Dirección</label>
                                    <div className="col-sm-9">
                                    <input type="text" className="form-control" name='us_direccion' id="us_direccion" 
                                        defaultValue={usuarios.us_direccion} onChange={handledChange}  required/> 
                                    </div>
                                    
                                </div>                            
                                <div className="mb-1 row">
                                    <label className="col-sm-3 col-form-label" htmlFor="us_ciudad">Ciudad</label>
                                    <div className="col-sm-9">
                                        <input type="text" className="form-control" name='us_ciudad' id="us_ciudad" 
                                        defaultValue={usuarios.us_ciudad} onChange={handledChange} required/> 
                                    </div>
                                </div>

                                <div className="mb-1 row">
                                    <label className="col-sm-3 col-form-label" htmlFor="us_email">Correo</label>
                                    <div className="col-sm-9">
                                        <input type="mail" className="form-control " name='us_email' id="us_email" 
                                        defaultValue={usuarios.us_email} onChange={handledChange} required/> 
                                    </div>
                                </div>
                                <div className="mb-1 row">
                                    <label className="col-sm-3 col-form-label" htmlFor="us_telefono">us_telefono</label>
                                    <div className="col-sm-9">
                                        <input type="text" className="form-control" name='us_telefono' id="us_telefono" 
                                        defaultValue={usuarios.us_telefono} onChange={handledChange} required/> 
                                    </div>
                                </div>
                                <div className="mb-1 row">
                                    <label className="col-sm-3 col-form-label" htmlFor="us_codigo">Código</label>
                                    <div className="col-sm-9">
                                        <input type="text" className="form-control" name='us_codigo' id="us_codigo" 
                                        defaultValue={usuarios.us_codigo} onChange={handledChange}/> 
                                    </div>
                                </div>
                                <div className="mb-1 row">
                                    <label className="col-sm-3 col-form-label" htmlFor="us_tipoDoc">Tipo doc</label>
                                    <div className="col-sm-9">
                                        <input type="radio" value="C" name='us_tipoDoc'
                                        defaultValue={usuarios.us_tipoDoc} onChange={handledChange}
                                        checked={usuarios.us_tipoDoc === "C"}/> Céd Ciudadanía
                                        <input type="radio" value="A" name='us_tipoDoc'
                                        defaultValue={usuarios.us_tipoDoc} onChange={handledChange}
                                        checked={usuarios.us_tipoDoc === "A"}/> Ced Extranjería
                                        <input type="radio" value="P" name='us_tipoDoc'
                                        defaultValue={usuarios.us_tipoDoc} onChange={handledChange}
                                        checked={usuarios.us_tipoDoc === "P"}/> Pasaporte
                                    </div>
                                </div> 
                                <div className="mb-1 row">
                                    <label className="col-sm-3 col-form-label" htmlFor="us_nroDoc">Nro Doc</label>
                                    <div className="col-sm-9">
                                        <input type="text" className="form-control" name='us_nroDoc' id="us_nroDoc" 
                                        defaultValue={usuarios.us_nroDoc} onChange={handledChange} required/> 
                                    </div>
                                </div>                                                                
{/* //id, us_idEmpresa,  us_localidad, us_barrio, , , us_clave, ,  */}                                
                                <div className="mb-1 row">
                                    <label className="col-sm-3 col-form-label" htmlFor="us_nivel">Nivel</label>
                                    <div className="col-sm-9">
                                        <input type="radio" value="C" name='us_nivel'
                                        defaultValue={usuarios.us_nivel} onChange={handledChange}
                                        checked={usuarios.us_nivel === "C"}/> Consultas
                                        <input type="radio" value="A" name='us_nivel'
                                        defaultValue={usuarios.us_nivel} onChange={handledChange}
                                        checked={usuarios.us_nivel === "A"}/> Administra
                                    </div>
                                </div>                             
                                <div className="mb-1 row">
                                    <label className="col-sm-3 col-form-label" htmlFor="us_estado">Estado</label>
                                    <div className="col-sm-9">
                                        <input type="radio" value="A" name='us_estado'
                                        defaultValue={usuarios.us_estado} onChange={handledChange}
                                        checked={usuarios.us_estado === "A"}/> Activo
                                        <input type="radio" value="I" name='us_estado'
                                        defaultValue={usuarios.us_estado} onChange={handledChange}
                                        checked={usuarios.us_estado === "I"}/> Inactivo
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
  
  export default UsuariosForm
