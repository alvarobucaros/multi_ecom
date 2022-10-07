import Image from 'next/image';

const Card = (props) => {

    return(
    <div className="conten-card">
        <div className='card-titulo'>
            <h4>{props.titulo}</h4>
        </div>
        <div className="card-imagen">
            <Image src={props.imagen} width={'90%'} height={'90%'}></Image>
        </div>
        <div className="card-detalle">
            <p>{props.detalle}</p>
        </div>
        <div className='card-foot'>
        <h6>{props.oferta}</h6>
        </div>
    </div>
    )
}


export default Card;