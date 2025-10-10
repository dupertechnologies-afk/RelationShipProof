import { useState } from "react";

const EventHandling = () =>{
const[state,setState] = useState();
const handleChange = (e) =>{
   setState( e.target.value);
}
    return (
        <>
        <input value={state} onChange={handleChange}/>
        <h1>{state}</h1>
        </>
    );
}

export default EventHandling