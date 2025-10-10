import React, { useState } from 'react'

function FormHandling() {
    const [formData, setFormData] = useState({
        name:"",
        password:""
    })
    
    const handleChange = (e) =>{
        const {name,value} = e.target;

        setFormData((prev)=>({
...prev,
[name]: value
        }));
     }

     const handleSubmit = (e) => {
e.preventDefault();
console.log(formData);
    }
  return (
   <form onSubmit={handleSubmit}>
    <input name='name' placeholder='name' value={formData.name} onChange={handleChange}/>
    <input name='password' placeholder='password' value={formData.password} onChange={handleChange}/>
    <button type='submit'>submit</button>
   </form>
  )
}

export default FormHandling