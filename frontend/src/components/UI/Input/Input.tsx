import { FC } from 'react'
import classes from './Input.module.scss'

interface InputProps {
  type: string,
  placeholder?: string,
}

const Input: FC<InputProps> = ({type="text", placeholder}) => {
  const inputClass = type === 'search' ? classes.search : classes.input;

  return (
    <input placeholder={placeholder} className={inputClass}/>
  )
}

export default Input
