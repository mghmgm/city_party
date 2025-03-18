import React, { FC, ReactNode } from 'react';
import classes from './Button.module.scss';

interface ButtonProps {
  href?: string,
  type?: 'main' | 'sub', 
  className?: string,
  children?: ReactNode,
}

const Button: FC<ButtonProps> = ({ href, children, type = 'main', className=''}) => {
  const buttonClass = type === 'main' ? 'button-main' : 'button-sub';
  const finalClassName = `${className} ${classes[buttonClass]}`;

  return href ? (
    <a className={finalClassName} href={href}>
      {children}
    </a>
  ) : (
    <button className={finalClassName}>{children}</button>
  );
};

export default Button;
