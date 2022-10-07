
import React, { useState} from 'react';

import Foot from '../components/footer'
import Menu from '../components/Menu'

function mmnto() {
  
      const [estado, setEstado] = useState('');
      
      return (
        <div>
          <div className="App"> 
              <Menu estado={estado} ></Menu>
          </div>  
            <Foot/>
        </div> 
      );
 }

export default mmnto