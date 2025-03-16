import React from 'react'
import classes from './Input.module.scss'

const Input = ({type="text", ...props}) => {
  const inputClass = type === 'search' ? classes.search : classes.input;

  return (
    <input {...props} className={inputClass}/>
  )
}

export default Input
