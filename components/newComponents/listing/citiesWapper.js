import React from 'react'

function citiesWapper({mrt,imgUrl}) {
  return (
  <div className="citiesWapper">
    <div className="citiesWapperContainer">
     <img  className = {`${mrt}`}src={imgUrl} width={'100%'} height={'80%'}/>
    </div>
    </div>
  )
}

export default citiesWapper