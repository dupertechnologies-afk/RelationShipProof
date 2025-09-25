import { useState } from "react"

const Counter = ()=>{
    const[state,setState] = useState(0);
    return (
        <>
        <button onClick={()=>setState(state+1)}>-</button>
        <h1>{state}rerfdfsds</h1>
        <button  onClick={()=>setState(state-1)}>+</button>
        </>
    )
}

export default Counter