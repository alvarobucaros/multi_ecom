import {pool} from "../../../config/db";

export default async function handler(req, res) {

    if (req.method == 'POST'){
        return await postDatos(req, res);
    }
}

const postDatos = async (req,res)  => {
    let arg = req.query.arg;
   // 'ingre|'+empresa+'|'+abono.nroAbono;
    let arr = arg.split('|');
    let op = arr[0];
    let e  = arr[1];
    if (op == 'ingre' ){
    let nro = arr[2];
    let sql = 'UPDATE empresas SET  em_consecRcaja = ' + nro 
    sql += "  WHERE id = " + e;

    const [result] = await pool.query(sql);
    return res.status(200).json(result);   

    }
}