import React, { FC, ReactNode } from 'react';
import classes from './Button.module.scss';

interface ButtonProps {
  href?: string,
  styleType?: 'main' | 'sub', 
  className?: string,
  children?: ReactNode,
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

const Button: FC<ButtonProps> = ({ href, children, styleType = 'main', className='', onClick, type}) => {
  const buttonClass = styleType === 'main' ? 'button-main' : 'button-sub';
  const finalClassName = `${className} ${classes[buttonClass]}`;

  return href ? (
    <a className={finalClassName} href={href}>
      {children}
    </a>
  ) : (
    <button className={finalClassName} onClick={onClick} type={type}>{children}</button>
  );
};

export default Button;
