import React, { useEffect, useState} from 'react';
import axios from 'axios';
import Image from 'next/image'
import { Button, Modal, ModalFooter, ModalHeader, ModalBody} from "reactstrap"

import Card from '../components/card'
import Producto from '../components/VerProducto';
import logo from  '../img/logos/puntocruz.jpg';
import carrito from '../img/logos/car2.jpg';
import fase from '../img/logos/fase.png';
import insta from '../img/logos/insta.png';
import twitt from '../img/logos/twitt.png';
import whats from '../img/logos/whats.png';

function main() {

  const [modalContacto, setModalContacto] = React.useState(false);
  const toggle_contacto = () => setModalContacto(!modalContacto);

  const [modalEmpresa, setModalEmpresa] = React.useState(false);
  const toggle_Empresa = () => setModalEmpresa(!modalEmpresa);

  const [modalCarrito, setModalCarrito] = React.useState(false);
  const toggle_Carrito = () => setModalCarrito(!modalCarrito);

  const [modalProducto, setModalProducto] = React.useState(false);
  const toggle_Producto = () => setModalProducto(!modalProducto);

  const empresa = 1;
 
  var   [misDatos] = [{}];

  var [empresaSelect, setEmpresaSelect] = useState({id:'', em_nombre:'', em_direccion:'', 
    em_zona:'', em_localidad:'', em_barrio:'', em_nit:'', em_telefono:'', em_email:'',
    em_usuario:'', em_sloganppal:'', em_slogansec:'', em_negocio:'', em_observaciones:'',
    em_autentica:'', em_ciudad:''});

    const [productos, setProductos]  = useState({id:'', pr_idEmpresa:'', pr_idTipo:'', 
    pr_codigo:'', pr_descipcion:'',pr_foto:'',  pr_titulo:'',  pr_diasVenta:'', 
    pr_precio:'', pr_inventario:'', pr_existencias:'', pr_descPesos:'', pr_descPorcentaje:'', 
    pr_iva:'', pr_marca:'', pr_referencia:'', pr_estado:'',  pr_tipoproductoId:'', 
    pr_ofertaDesde:'', pr_ofertaHasta:'', pr_usuario:''  });

    const [prds, setPrds]  = useState([]);

  const [contactos, setContactos] = useState({cont_nombre:'', cont_email:'', cont_telefono:'', 
  cont_mensaje:'', cont_tipo:'', cont_fecha:''})

  const [contactoValue, setContactoValue] = useState("C");

  const [tiposContacto, setTiposContacto] = useState([
    {codigo:'C', detalle:'Consulta'},
    {codigo:'Q', detalle:'Queja'},
    {codigo:'S', detalle:'Solicitud'}])


    const ubicacion = empresaSelect.em_direccion + ' - ' +empresaSelect.em_barrio+ ' - ' + empresaSelect.em_localidad
    const [tipoProd, setTipoProd] =  useState({  
      id:0, 
      tp_descipcion:''
    })

    const [tipos, setTipos] = useState([])

    const imagen = require('../assets/images/car1.jpg');

  useEffect(()=>{
    traeEmpresa(empresa)
    traeTipos(empresa)
    traeProductos(empresa)
  },[])

  async function traeEmpresa(empresa){ 
    await  axios.get('http://localhost:3000/api/empresas/'+empresa)
    .then(res=>{
      misDatos=res.data[0];       
      setEmpresaSelect(misDatos) 
    })
  }

  async function traeTipos(empresa){ 
    const ruta = "http://localhost:3000/api/tipos?e="+empresa+"&op=combo";
    await axios.get(ruta)    
    .then(res=>{
      misDatos=res.data;  
      setTipos(misDatos.map(dat => {
        let properties = {
          "id": dat.id,
          "tp_descipcion": dat.tp_descipcion,
        };
        return properties;
       })); 
    })
  }

  async function traeProductos(empresa){
    let hoy = new Date().toISOString().slice(0, -14);    
    let url = "http://localhost:3000/api/productos?e="+empresa+"&op=ofertas&p="+contactos.cont_tipo+"&f="+hoy;
   // alert(url)
    await  axios.get(url)
    .then(res=>{
        misDatos=res.data;
        setProductos(misDatos);
        setPrds(misDatos.map(dat => {
          let oferta='';
          let descuento='';
          if(dat.pr_descPorcentaje > 0 ){
            oferta = 'Descuento '+dat.pr_descPorcentaje+'%'
            descuento='%';
          }
          if(dat.pr_descPesos > 0 ){
            oferta = 'Descuento $'+dat.pr_descPesos;
            descuento='$';
          }
          let properties = {
            "id": dat.id,
            "pr_idTipo": dat.pr_idTipo,
            "pr_codigo": dat.pr_codigo,
            "pr_descipcion": dat.pr_descipcion,
            "pr_foto": '/fotos/'+dat.pr_idTipo+'/'+dat.pr_foto,
            "pr_titulo": dat.pr_titulo,
            "pr_precio": dat.pr_precio,
            "pr_iva": dat.pr_iva,
            "pr_descPesos": dat.pr_descPesos,
            "pr_descPorcentaje": dat.pr_descPorcentaje,
            "pr_tipoproductoId": dat.pr_tipoproductoId,
            "pr_oferta": oferta,
          };
          return properties;
         })); 
    })
}  

const handledChange = ({target: {name, value}}) => {
  setContactos({...contactos, [name]: value});
}

function handleContacto(rec){
  setModalContacto(!modalContacto);
}
function handleEmpresa(rec){
  setModalEmpresa(!modalEmpresa);
}
function handleCarrito(rec){
  setModalCarrito(!modalCarrito);
}
function handleProducto(rec){
  setProductos(rec);
  setModalProducto(!modalProducto);
}

async function EnviaContacto(){  
  let hoy = new Date(); 
let dato = contactos.cont_nombre+'|'+contactos.cont_email+'|'+contactos.cont_telefono
dato += '|'+contactos.cont_mensaje+'|'+contactoValue+'|'+hoy.toISOString();
// alert(dato);
  setModalContacto(!modalContacto);
}



function handleCont_tipoChange(e) {
  contactos.cont_tipo=e;
 // alert(contactos.cont_tipo)
  traeProductos(empresa)
}

  return (
    <> 
    <div className="container">
         <div className="header">
             <div>
             <Image src={logo} alt="Empresa" width="120px" height="80px"/>
             </div>           
             <div className='titulares'>                
                 <div><label className="titulin">{empresaSelect.em_nombre}</label></div>
                 <div><label className="subTitulos">{empresaSelect.em_sloganppal}</label></div>
                 <div><label className="subTitulos">{empresaSelect.em_slogansec}</label></div>
             </div>
         </div>
         <div className="item">
            <div className='titulos'>
              <div>
                  <label>Tipos de Producto: </label>
              </div>
              <div>
                  <select id='agenda_comiteId' name='agenda_comiteId'
                  onChange={(e) => {handleCont_tipoChange(e.target.value)}} >

                      <option key={0} value={0}> Todos</option>
                      {tipos.map((cp)=>(
                      <option key={cp.id} value={cp.id}>  {cp.tp_descipcion}</option>
                    ))}                     
                  </select>
              </div>
                
            </div>
            <div>
                 <button className="btn" onClick={() => handleEmpresa()}>Nuestra Empresa</button>
                 <button className="btn" onClick={() => handleContacto()}>Contáctenos</button>
            </div>
            <div className='carrito' alt="" width="25%" height="25%">
                 <label> 
                 <Image src={carrito} alt="Carro de compras" width="50px" height="30px"
                 onClick={() => handleCarrito()}/>
                 </label>
            </div>
        </div>
         <div className='principal'>
                 
            {prds.map((prod)=>(
              <div>
                <div>
                  <Card titulo={prod.pr_titulo} imagen={prod.pr_foto}
                  detalle={prod.pr_descipcion} oferta={prod.pr_oferta}/> 
                </div>
                <div>
                <label className='btn'  onClick={() => handleProducto(prod)}> Ver Producto </label>                
                </div>
              </div>              
            ))}   
         </div>
        <div className="footer">
             <div className="ubicacion">
                 <div>Dirección: {empresaSelect.em_direccion}</div>
                 <div>Ciudad: {empresaSelect.em_ciudad} - {empresaSelect.em_barrio}</div>
             </div>
             <div className="telefonos">
                 <div>Nit: {empresaSelect.em_nit}</div>
                 <div>Tel: {empresaSelect.em_telefono}</div>
             </div>
             <div className="telefonos">
                 <div>E-mail: {empresaSelect.em_email}</div>
                 {/* <div>Negocio: {empresaSelect.em_negocio}</div> */}
             </div>
             <div className="redes">
              <Image src={whats} alt="Whats" width="20px" height="20px"/>
              <Image src={twitt} alt="Whats" width="20px" height="20px"/>
              <Image src={insta} alt="Whats" width="20px" height="20px"/>
              <Image src={fase} alt="Whats" width="20px" height="20px"/>
              </div>
         </div>
     </div>

     <div className='modal1'>    
        <Modal isOpen={modalContacto} toggle_contacto={toggle_contacto}>
        <ModalHeader  toggle_contacto={toggle_contacto}>CONTACTENOS</ModalHeader>
            <ModalBody>
            <div className="mb-1 row">
                <label className="col-sm-3 col-form-label" >Nombre</label>
                <div className="col-sm-9">
                <input type="text" className="form-control"  
                    defaultValue={contactos.cont_nombre} onChange={handledChange} /> 
                </div>
            </div>
            <div className="mb-1 row">
                <label className="col-sm-3 col-form-label" >Correo</label>
                <div className="col-sm-9">
                <input type="text" className="form-control"  
                    defaultValue={contactos.cont_email} onChange={handledChange}/> 
                </div>
            </div>
            <div className="mb-1 row">
                <label className="col-sm-3 col-form-label" >Teléfono</label>
                <div className="col-sm-9">
                <input type="text" className="form-control"  
                    defaultValue={contactos.cont_telefono} onChange={handledChange} /> 
                </div>
            </div>
            <div className="mb-1 row">
                <label className="col-sm-3 col-form-label" >Mensaje</label>
                <div className="col-sm-9">
                <textarea type="text" className="form-control"  rows={5} cols={40}
                    defaultValue={contactos.cont_mensaje} onChange={handledChange} /> 
                </div>
            </div> 
            <div className="mb-1 row">
                <label className="col-sm-3 col-form-label" >Tipo </label>
                <div className="col-sm-9">
                <select value={contactoValue}                       
                        onChange={(e) => {setContactoValue(e.target.value)}} >
                          {tiposContacto.map((tipo)=>(
                            <option value={tipo.codigo}>{tipo.detalle}</option>
                          ))}
                    </select> 
                </div>
            </div>                      
            <div>
                <Button color="primary" onClick={toggle_contacto}>Cancela</Button>
                <Button color="primary" onClick={EnviaContacto}>Envía</Button>
            </div>
            </ModalBody>
        </Modal>
    </div>

    <div className='modal1'>    
        <Modal isOpen={modalEmpresa} toggle_Empresa={toggle_Empresa}>
        <ModalHeader  toggle_Empresa={toggle_Empresa}>LA EMPRESA</ModalHeader>
            <ModalBody>
            <div className="mb-1 row">
                <label className="col-sm-3 col-form-label" >Nombre</label>
                <div className="col-sm-9">
                <input type="text" className="form-control"  
                    defaultValue={empresaSelect.em_nombre}  readonly="true"/> 
                </div>
            </div>
            <div className="mb-1 row">
                <label className="col-sm-3 col-form-label" >Nit</label>
                <div className="col-sm-9">
                <input type="text" className="form-control"  
                    defaultValue={empresaSelect.em_nit} readonly="true"/> 
                </div>
            </div>
            <div className="mb-1 row">
                <label className="col-sm-3 col-form-label" >Teléfonos</label>
                <div className="col-sm-9">
                <input type="text" className="form-control"  
                    defaultValue={empresaSelect.em_telefono} readonly="true"/> 
                </div>
            </div>
            <div className="mb-1 row">
                <label className="col-sm-3 col-form-label" >E-mail</label>
                <div className="col-sm-9">
                <input type="text" className="form-control"  
                    defaultValue={empresaSelect.em_email} readonly="true"/> 
                </div>
            </div>
            <div className="mb-1 row">
                <label className="col-sm-3 col-form-label" >Direccion</label>
                <div className="col-sm-9">
                <input type="text" className="form-control"  
                    defaultValue={ubicacion  } readonly="true"/> 
                </div>

                <label className="col-sm-3 col-form-label" >Ciudad</label>
                <div className="col-sm-9">
                <input type="text" className="form-control"  
                    defaultValue={empresaSelect.em_ciudad} readonly="true"/> 
                </div>
            </div>            
            <div>
                <Button color="primary" onClick={toggle_Empresa}>Regresa</Button>
             </div>
            </ModalBody>
        </Modal>
    </div>

    <div className='modal1'>    
        <Modal isOpen={modalCarrito} toggle_Carrito={toggle_Carrito}>
        <ModalHeader  toggle_Carrito={toggle_Carrito}>MI CARRITO</ModalHeader>
            <ModalBody>
            
            <div>
                <Button color="primary" onClick={toggle_Carrito}>Regresa</Button>
            </div>
            </ModalBody>
        </Modal>
    </div>

    <div className='modal1'>    
        <Modal isOpen={modalProducto} toggle_Producto={toggle_Producto}>
        <ModalHeader  toggle_Producto={toggle_Producto}>{productos.pr_titulo} </ModalHeader>
            <ModalBody>
            <Image src={productos.pr_foto} width={'90%'} height={'90%'}></Image>
            <div>{productos.pr_idTipo} / {productos.pr_codigo}</div>
            
            {productos.pr_descipcion} 
            <div> Precio: {productos.pr_precio} </div>
            <div>Desuento $:{productos.pr_descPesos} </div>
            <div>Descunto %:{productos.pr_descPorcentaje} </div>
            <div>IVA : {productos.pr_iva} </div>
            <div>Oferta: {productos.pr_oferta}</div>
            <hr></hr>
            <div className="mb-1 row">
                <label className="col-sm-3 col-form-label" >Cantidad </label>
                <div className="col-sm-9">
                <input type="text" className="form-control"  
                     /> 
                </div>
            </div>


            <div>
                <Button color="primary" onClick={toggle_Producto}>Regresa</Button>
            </div>
            </ModalBody>
        </Modal>
    </div>

 </>
  )
}

export default main