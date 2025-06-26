import React,{useState} from 'react'


function NavbarCities({activeIndexCity,active}) {
     const cities =['Gurgaon','Pune','Noida','Ghaziabad']
   

    const handleClick=(index)=>{
        activeIndexCity(index)
    }

  return (
<div className='nav'>
    {cities.map((city,index)=>(
        <div className='nav-item'
        key={index}
        onClick={()=>handleClick(index)}>
       <button className={index == active? "nav-link nav-active" : "nav-link"}>
  {city}
</button>


        </div>
    ))}

</div>
  )
}

export default NavbarCities