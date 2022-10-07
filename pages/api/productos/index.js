import { useState } from "react";
import {pool} from "../../../config/db";

export default async function handler(req, res) {
 
  switch(req.method){
    case 'GET':
      return await getProductos(req, res);

    case 'POST': 
      return await saveProductos(req, res);

    case 'PUT': 
      return await updateProductos(req, res);
      
    case 'DELETE':
      return await deleteProductos(req, res);
   //   return res.status(200).json('Delete products')
  }
}

const getProductos = async (req,res)  => {
   const e = req.query.e;
   const op = req.query.op;
   let sql= '';
   let f='';
   let p='';
   if (op==='ofertas'){
    f = req.query.f;
    p = req.query.p;
   }
   //console.log(op+'-'+e+'-'+f+'-'+p)
  
   if (op==='combo'){
      sql += 'SELECT id, pr_codigo, pr_descipcion '
      sql += ' FROM productos  ';
      sql += ' WHERE pr_estado = "A" AND pr_idEmpresa = ' + e;
      sql += ' ORDER BY pr_descipcion ';	      
      const [result] = await pool.query(sql);
      return res.status(200).json(result);
   }
   if (op==='todos'){
      sql += ' SELECT id, pr_idEmpresa, pr_idTipo, pr_codigo, pr_descipcion, ';
      sql += ' pr_foto, pr_titulo, pr_diasVenta, pr_precio, pr_inventario, ';
      sql += ' pr_existencias, pr_descPesos, pr_descPorcentaje, ';
      sql += ' pr_iva, pr_marca, pr_referencia, pr_estado, pr_tipoproductoId, ';
      sql += ' pr_ofertaDesde, pr_ofertaHasta, pr_usuario ';
      sql += ' FROM productos  ';
      sql += ' WHERE  pr_idEmpresa = ' + e;
      sql += ' ORDER BY pr_descipcion ';	
      const [result] = await pool.query(sql);
      return res.status(200).json(result);
    }
    if (op==='ofertas'){
      sql += " SELECT id, pr_idEmpresa, pr_idTipo, pr_codigo, pr_descipcion, ";
      sql += " pr_foto, pr_titulo, pr_diasVenta, pr_precio, pr_inventario, ";
      sql += " pr_existencias, pr_descPesos, pr_descPorcentaje, ";
      sql += " pr_iva, pr_marca, pr_referencia, pr_estado, pr_tipoproductoId, ";
      sql += " pr_ofertaDesde, pr_ofertaHasta, pr_usuario ";
      sql += " FROM productos  ";
      sql += " WHERE pr_estado='A' AND pr_idEmpresa = " + e  
      sql += " AND pr_ofertaHasta >= '" + f +"'";
      if(p !=''){
        if (p != 0){
        sql += " AND pr_tipoproductoId =  " + p
        }
      }else{
        sql += " AND (pr_descPesos > 0 OR pr_descPorcentaje > 0  )"
      }
    sql += " ORDER BY pr_descipcion ";	
  //console.log(sql);
  const [result] = await pool.query(sql);
  return res.status(200).json(result);
  }
}
 

