import React from 'react'

function developer({propertyData}) {
  return (
   <>
   <div className='pd' style={{display:'flex'}}>
   <div className='card card-w '>
    <h2 className='heading-developer-name'> {propertyData.developer.name}</h2>
    <div className='boldline1'></div>
    <p className='p-text-style p-text'> 
        {propertyData.developer.description}
    </p>
    </div>
   </div>
   </>
  )
}

export default developer