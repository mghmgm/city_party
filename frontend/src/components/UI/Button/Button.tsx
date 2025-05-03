import React, { FC, ReactNode } from 'react';
import classes from './Button.module.scss';

interface ButtonProps {
  href?: string,
  styleType?: 'main' | 'sub', 
  className?: string,
  children?: ReactNode,
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  isDisabled?: boolean;
}

const Button: FC<ButtonProps> = ({ href, children, styleType = 'main', className='', onClick, type, isDisabled}) => {
  const buttonClass = styleType === 'main' ? 'button-main' : 'button-sub';
  const finalClassName = `${className} ${classes[buttonClass]}`;

  return href ? (
    <a className={finalClassName} href={href}>
      {children}
    </a>
  ) : (
    <button className={finalClassName} onClick={onClick} type={type} disabled={isDisabled}>{children}</button>
  );
};

export default Button;
