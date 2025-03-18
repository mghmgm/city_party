import React, { FC } from 'react'
import classes from './Input.module.scss'

interface InputProps {
  type: string,
}

const Input: FC<InputProps> = ({type="text", ...props}) => {
  const inputClass = type === 'search' ? classes.search : classes.input;

  return (
    <input {...props} className={inputClass}/>
  )
}

export default Input
