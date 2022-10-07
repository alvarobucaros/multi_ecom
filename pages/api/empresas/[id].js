
import {pool} from "../../../config/db";

export default async function handler(req, res) {

    switch(req.method){
      case 'GET':
        return await getEmpresas(req, res);
  
      case 'POST': 
        return await saveEmpresas(req, res);
  
      default:
            return;
    }
}

    const getEmpresas = async (req,res)  => {
        let id  = req.query.id;
        var sql = 'SELECT id, em_nombre, em_direccion, em_zona, em_localidad, em_barrio, ';
        sql += ' em_nit, em_telefono, em_email, em_usuario, em_sloganppal, em_slogansec, ';
        sql += ' em_negocio, em_observaciones, em_autentica, em_ciudad';
        sql += ' FROM empresas ';
        sql += ' WHERE id = ?';
        
        const [result] = await pool.query(sql,id);
        return res.status(200).json(result);
      }

      
    const saveEmpresas = async (req, res) => {
      req.getConnection((err, conn) => {
        a= req.body.id+' '+req.body.em_nombre+' '+req.body.em_direccion+' '+req.body.em_zona+' '
        a += req.body.em_localidad+' '+req.body.em_barrio+' '+req.body.em_nit+' '
        a += req.body.em_telefono+' '+req.body.em_email+' '+ req.body.em_usuario+' '
        a += req.body.em_sloganppal+' '+ req.body.em_slogansec+' '+req.body.em_negocio+' '
        a += req.body.em_observaciones+' '+req.body.em_autentica+' '+req.body.em_ciudad
// console.log(a);
         if(req.body.id==='0')  {
          var sql= 'INSERT INTO empresas(em_nombre, em_direccion, em_zona, em_localidad, ' ;
          sql += ' em_barrio, em_nit, em_telefono, em_email, em_usuario, em_sloganppal, ' ;
          sql += ' em_slogansec, em_negocio, em_observaciones, em_autentica, em_ciudad) '; 
          sql += ' VALUES (  ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,? ) ' ;
//console.log(sql+' insert');
          conn.query(sql, [req.body.em_nombre, req.body.em_direccion, req.body.em_zona, 
            req.body.em_localidad, req.body.em_barrio, req.body.em_nit, req.body.em_telefono,
             req.body.em_email, req.body.em_usuario, req.body.em_sloganppal, 
             req.body.em_slogansec, req.body.em_negocio, req.body.em_observaciones, 
             req.body.em_autentica, req.body.em_ciudad], 
            (err, rows) => {
            res.err;
          });
        }
        else{
          var sql= 'UPDATE empresas  SET em_nombre = ?, em_direccion = ?, em_zona = ?,  ' ;
          sql += 'em_localidad = ?, em_barrio = ?, em_nit = ?, em_telefono = ?,  ' ;
          sql += 'em_email = ?, em_usuario = ?, em_sloganppal = ?, em_slogansec = ?,  ' ;
          sql += 'em_negocio = ?, em_observaciones = ?, em_autentica = ?, em_ciudad = ? ';
          sql += ' WHERE id = ? '
//console.log(sql+' update');
         conn.query(sql, [req.body.em_nombre, req.body.em_direccion, req.body.em_zona, 
          req.body.em_localidad, req.body.em_barrio, req.body.em_nit, req.body.em_telefono,
           req.body.em_email, req.body.em_usuario, req.body.em_sloganppal, 
           req.body.em_slogansec, req.body.em_negocio, req.body.em_observaciones, 
           req.body.em_autentica, req.body.em_ciudad, req.body.id],         
           (err, rows) => {
         res.err;
          });    
        }
        })  
       }; 
    

