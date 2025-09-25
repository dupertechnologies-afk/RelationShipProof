import React from 'react'

function Parent() {
   const dt = (data)=>{
    console.log("parent",data);
   }
  return (
    <Child msg={dt}/>
  )
}

export default Parent


function Child({msg}) {
    return (
        <div>{msg("child")}</div>
    )
}
