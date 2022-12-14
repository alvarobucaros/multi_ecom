import React, {useState} from 'react';
import Head from 'next/head'
import Main from '../components/main'
import Foot from '../components/footer'

export default function Home() {

  const [data, setData] = useState('');
  const [autentica, setAutentica] = useState(true);
  

  return (
    <div>
      <Head>
        <title>MultiEcom</title>
        <meta name="description" content="Producto de AEI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      
        <header> 
          {
            <Main/>
          }
        </header>
      


      <Foot/>
    </div>
  )
}
