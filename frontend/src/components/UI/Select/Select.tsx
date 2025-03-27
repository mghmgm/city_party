import { FC } from 'react';
import classes from './Select.module.scss';

interface SelectProps {
  options: string[];
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  value: string;
  name?: string,
  id?: string,
  className?: string,
}

const Select: FC<SelectProps> = ({ options, onChange, value, name, id, className}) => {
  return (
    <select name={name} id={id} className={classes.select+' '+className} value={value}  onChange={onChange}>
      {options.map((optionName, index) => (
        <option value={optionName} key={index}>
          {optionName}
        </option>
      ))}
    </select>
  );
};

export default Select;
