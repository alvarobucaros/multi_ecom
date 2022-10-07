import React from 'react';
import Head from 'next/head'
import Main from '../components/main'
import Foot from '../components/footer'

function admin() {
  return (
    <div>
        <Head>
        <title>MultiEcom</title>
        <meta name="description" content="Producto de AEI" />
        <link rel="icon" href="/favicon.ico" />
        </Head>

        <header> 
          {
            <p> esto es lo que viene para mantenimiento</p>
          }
        </header>

        <Foot/>
    </div>
  )
}

export default admin