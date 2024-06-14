import { FC } from 'react';
import { Link } from 'react-router-dom';

type TextInputProps = {
    value: string;
    updateValue: (value: string) => void;
    label: string;
};

const TextInput: FC<TextInputProps> = ({ label, ...props }: TextInputProps) => (
    <>
        {' '}
        <label htmlFor={label}>{label}</label>{' '}
        <input
          id={label}
          value={props.value}
          onChange={(e) => props.updateValue(e.target.value)}
          type="text"
        />
    </>
);

export { TextInput };
