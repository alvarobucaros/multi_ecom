import Link from 'next/link'

const LinkMenu = (props) => {
  const links = props.links;
  const detalle = props.detalle;
  const empresa = props.empresa;
  const usuario = props.usuario;
  const nivel = props.nivel;

  return (
    <Link href={{ pathname: links, query: { e: empresa, u:usuario, n:nivel} }}><a className='btn-menu'>{detalle}</a></Link>
  )
}

export default LinkMenu