import { useState } from "react";
import {pool} from "../../../config/db";

export default async function handler(req, res) {
 
  switch(req.method){
    case 'GET':
      return await getTipos(req, res);

    case 'POST': 
      return await saveTipos(req, res);

    case 'PUT': 
      return await updateTipos(req, res);
      
    case 'DELETE':
      return await deleteTipos(req, res);
   //   return res.status(200).json('Delete products')
  }
}

const getTipos = async (req,res)  => {
   let e = req.query.e;
   let op = req.query.op;

   if (op==='combo'){
        let sql= 'SELECT id, tp_descipcion '
        sql += ' FROM tipoproductos  ';
        sql += ' WHERE tp_estado = "A" AND tp_idEmpresa = ' + e;
        sql += ' ORDER BY tp_descipcion ';	      
   const [result] = await pool.query(sql);
   return res.status(200).json(result);
   }
   if (op==='todos'){
    let sql= 'SELECT id, tp_idEmpresa, tp_codigo, tp_descipcion, ';
    sql += ' tp_estado, tp_usuario  FROM tipoproductos  ';
    sql += ' WHERE  tp_idEmpresa = ' + e;
    sql += ' ORDER BY tp_descipcion ';	      
const [result] = await pool.query(sql);
return res.status(200).json(result);
}
}
 