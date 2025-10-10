import React from 'react'

function ListRendering() {
    let fruits = ["Apple", "Banana", "Mango"]
  return (
    <ul>
        {
        fruits.map((f,k)=>(
             <li key={k}>{f}</li>
        ))
    }
    </ul>
  )
}

export default ListRendering