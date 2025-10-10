import React,{useEffect, useState} from 'react'

function WindowResize() {
    const [wisize,setWisize] = useState();
    useEffect(() => {
      const handleResize = () => {
        setWisize( window.innerWidth);
      }
        
      window.addEventListener('resize', handleResize)
      return () =>{
        window.removeEventListener('resize',handleResize)
      }
    }, [wisize]) 
  return (
    <div>WindowResize:{wisize}</div>
  )
}

export default WindowResize