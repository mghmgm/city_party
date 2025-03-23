import { FC } from 'react';
import classes from './Input.module.scss';

interface InputProps {
  type: string;
  placeholder?: string;
  label?: string;
  id: string;
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
}

const Input: FC<InputProps> = ({ type, placeholder, label, id, checked, onChange, value }) => {
  const inputClass = type === 'search' ? classes.search : classes.input;

  if (type === 'checkbox') {
    return (
      <div className={classes.checkboxContainer}>
        <label htmlFor={id} className={classes.checkboxLabel}>
          <input type="checkbox" id={id} checked={checked} />
          <span className={classes.customCheckbox}></span>
          <span className={classes.checkboxText}>{label}</span>
        </label>
      </div>
    );
  }

  return (
    <div className={classes.inputContainer}>
      {label && (
        <label htmlFor={id} className={classes.label}>
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        className={inputClass}
        id={id}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default Input;
