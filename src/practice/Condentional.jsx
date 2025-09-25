import React, {useState} from 'react'

function Condentional() {
    const [state , setState] = useState(false);
    const handleClick = () => {
        setState(val => !val)
    }
  return (
   <button onClick={handleClick}>{state ? "login" : "logout"}</button>
  )
}

export default Condentional