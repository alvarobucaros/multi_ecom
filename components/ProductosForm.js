import axios from 'axios';
import React, { useEffect, useState} from 'react';
import {Button, Modal, ModalFooter, ModalHeader, ModalBody} from "reactstrap"
function ProductosForm(props) {
    const empresa = props.e;
    const usuario = props.u;
    const nivel = props.n;
   
    var   [misDatos] = [{}];
    const [registros, setRegistros] = useState([{}]);
    const [numeroPaginas, setNumeroPaginas] = useState(0);
    const registrosPorPagina = 6;
    var   totalRegistros = 0;
    const [pagina, setPagina] = useState(0);

     const [opcion, setOpcion] = useState('')
    const [aviso, setAviso] =useState('');


    const [productos, setProductos]  = useState({  
      id:0, 
      pr_idEmpresa:0, 
      pr_idTipo:'', 
      pr_codigo:'', 
      pr_descipcion:'', 
      pr_foto:'', 
      pr_titulo:'', 
      pr_diasVenta:'', 
      pr_precio:'', 
      pr_inventario:'', 
      pr_existencias:'', 
      pr_descPesos:'', 
      pr_descPorcentaje:'', 
      pr_iva:'', 
      pr_marca:'', 
      pr_referencia:'', 
      pr_estado:'', 
      pr_tipoproductoId:'', 
      pr_ofertaDesde:'', 
      pr_ofertaHasta:'', 
      pr_usuario:''
  })

 const [productosW, setProductosW]  = useState({  
      id:0, pr_idEmpresa:empresa, pr_idTipo:'',
      pr_idEmpresa:'', pr_codigo:'', pr_descipcion:'', 
      pr_foto:'', pr_titulo:'', pr_diasVenta:'', pr_precio:'', 
      pr_inventario:'', pr_existencias:'', pr_descPesos:'', 
      pr_descPorcentaje:'', pr_iva:'', pr_marca:'', 
      pr_referencia:'', pr_estado:'A', pr_tipoproductoId:'', 
      pr_ofertaDesde:'', pr_ofertaHasta:'', pr_usuario:''})

  const [modalDel, setModalDel] = React.useState(false);
  const toggle_del = () => setModalDel(!modalDel);
  const [modalPpal, setModalPpal] = React.useState(false);
  const toggle_ppal = () => setModalPpal(!modalPpal);

  const [codBorrado, setCodBorrado] = useState('');
  const [detBorrado, setDetBorrado] = useState('');
  
    useEffect(()=>{
        traeInfo(empresa)
      },[])
      
      async function traeInfo(empresa){ 
          
        await  axios.get('http://localhost:3000/api/productos?e='+empresa+'&op=todos')
        .then(res=>{
            misDatos=res.data; 
            setRegistros(misDatos)
            totalRegistros = misDatos.length;
            setNumeroPaginas( Math.ceil(totalRegistros / registrosPorPagina));
            var libros =  subTablaPartir(pagina);
            setRegistros(libros)
        })
      }

         //  Paginación
    function subTablaPartir(pagina){       
      var ini = pagina * registrosPorPagina;
      var fin = (ini + registrosPorPagina) ;
      var xdatos = [{}]
      let j=0;
      if(fin > totalRegistros) {fin = totalRegistros}
       for (var i = ini; i < fin; i++){
          xdatos[j] = misDatos[i];
          j+=1;
      }
      return xdatos; 
  }


async function paginar(op){
  // 0 primera, 9 ultima, 1 siguiente, 2 anterior, 0 ninguna
  let pagina =0
  switch (op) {
    case 2:
      if (pagina > 0){
          pagina -= 1;
      }
      if(pagina <0){pagina = 0}
      break;
    case 0:      
      pagina = 0
      break;
    case 1: 
      if (pagina < (numeroPaginas-1)){
          pagina += 1;
      }
      if(pagina >= numeroPaginas-1) {pagina = (numeroPaginas-1)}
      break;
    case 9:  
     pagina = (numeroPaginas - 1);
      break;   
  }
  setPagina(pagina);
  
  var libros = subTablaPartir(pagina);
  setRegistros(libros, [])
}

     // Fecha de ISO a amd
async function fecha(fch){
  var fecha = Date('MM/dd/YYY')
 
   if (fch != null && fch !== undefined) {
      fecha = fch.toLocaleDateString("en-US")  // m/d/a
      fch = fecha.split('/')
      fch = fch[2]+'/'+fch[0]+'/'+fch[1]
  }else{
      fch=new Date();
  }
 return fch;
}
function handleShow(rec){
  setDetBorrado(rec.pr_codigo + ' - ' + rec.pr_descipcion);
  setCodBorrado(rec.id)
  setModalDel(!modalDel);
}

async function handleShowPpal(rec){
  setProductos(rec)
  setModalPpal(!modalPpal);
}

async function ActualizaRegistro () { 
  let err=''
  productos.pr_idEmpresa=empresa;
  if(productos.pr_idTipo===''){err += ', Tipo';}
  if(productos.pr_codigo===''){err += ', Código';}

  if(productos.pr_descipcion===''){err += ', Descripción';}
  if(productos.pr_titulo===''){err += ', Título';}
  if(productos.pr_precio===''){err += ', Precio';}
  if(productos.pr_referencia===''){err += ', Referencia';}
  if(productos.pr_diasVenta===''){err += ', Dias venta';}

   if (err===''){
    if(productos.id === 0){   
    await  axios.post('http://localhost:3000/api/productos', productos)
    .then( alert('Información actualizada'),()=>{
    })
  }else{
    await  axios.put('http://localhost:3000/api/productos', productos)
    .then( alert('Información actualizada'),()=>{
    })   
  }

  traeInfo(empresa)
  setModalPpal(!modalPpal);
  }else{
      setAviso('Falta '+err)
  }
}

async function BorraRegistro(){  
  let id="productos|"+codBorrado;
  await  axios.delete('http://localhost:3000/api/generales/'+id)
  .then(res=>{
  })
  traeInfo(empresa)
  setModalDel(!modalDel);
}

const handledSubmit = async (e) => {
  e.preventDefault();
  setAviso('');
}

const handledChange = ({target: {name, value}}) => {
  setProductos({...productos, [name]: value});
}

  // id, pr_idEmpresa, pr_idTipo, pr_codigo, pr_descipcion, pr_foto, 
  // pr_titulo, pr_diasVenta, pr_precio, pr_inventario, pr_existencias, 
  // pr_descPesos, pr_descPorcentaje, pr_iva, pr_marca, pr_referencia, 
  // pr_estado, pr_tipoproductoId, pr_ofertaDesde, pr_ofertaHasta, 
  // pr_usuario

return (
<div>
  <div>
      <table   className='miTable'>
          <thead>  
              <tr key={0}>
                  <th className="">Código</th>                            
                  <th className="">Descripción</th> 
                  <th className="">Título</th>   
                  <th className="">Dias</th>
                  <th className="">Pecio</th>
                  <th className="">Iva</th>
                  <th className="">$ Desc</th> 
                  <th className="">% Desc</th>  
                  <th className="">Estado</th>                            
                  <th colSpan='2'>Comandos</th>
              </tr>
          </thead>
          <tbody>        
          {registros.map((rec, key) =>                
              <tr key={rec.id}>
                  <td className="trc">{rec.pr_codigo}</td>
                  <td className="trl">{rec.pr_descipcion}</td>
                  <td className="trc">{rec.pr_titulo}</td>
                  <td className="trc">{rec.pr_diasVenta}</td>
                  <td className="trl">{rec.pr_precio}</td>
                  <td className="trc">{rec.pr_iva}</td>
                  <td className="trc">{rec.pr_descPesos}</td>
                  <td className="trc">{rec.pr_descPorcentaje}</td>
                  <td className="trc">{rec.pr_estado}</td>
                  <td className="trc"><button onClick={() => handleShowPpal(rec)} className='btn'>Edita</button></td>
                  <td className="trc"><button onClick={() => handleShow(rec)} className='btn btn-sm btn-danger '>Anula</button></td>
              </tr>    
          )}
          </tbody>
      </table> 
      <div className='botones'>
          <div>
              <button onClick={() => paginar(0)} className='boton btn'> |&#8612; </button>
              <button onClick={() => paginar(2)} className='boton btn'> &larr; </button>
              <button onClick={() => paginar(1)} className='boton btn'> &rarr; </button>
              <button onClick={() => paginar(9)} className='boton btn'> &#8614;| </button>
              <button onClick={() => handleShowPpal(productosW)} className='btn btn-sm btn-primary '>Nuevo registro</button>        
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
                              <label className="col-sm-3 col-form-label" htmlFor="grp_nombre">Nombre</label>
                              <div className="col-sm-9">
                              <input type="text" className="form-control" name='grp_nombre' id="grp_nombre" 
                                  defaultValue={productos.grp_nombre} onChange={handledChange} /> 
                              </div>
                          </div>
                          <div className="mb-1 row">
                              <label className="col-sm-3 col-form-label" htmlFor="grp_detalle">Detalle</label>
                              <div className="col-sm-9">
                                  <textarea className="form-control" name='grp_detalle' id="grp_detalle" 
                                  defaultValue={productos.grp_detalle} onChange={handledChange}
                                  rows={3} cols={50}/>
                              </div>
                          </div>                            
                                
                          <div className="mb-1 row">
                              <label className="col-sm-3 col-form-label" htmlFor="grp_estado">Estado</label>
                              <div className="col-sm-9">
                                  <input type="radio" value="A" name='grp_estado'
                                  defaultValue={productos.grp_estado} onChange={handledChange}
                                  checked={productos.grp_estado === "A"}/> Activo
                                  <input type="radio" value="I" name='grp_estado'
                                  defaultValue={productos.grp_estado} onChange={handledChange}
                                  checked={productos.grp_estado === "I"}/> Inactivo
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


export default ProductosForm