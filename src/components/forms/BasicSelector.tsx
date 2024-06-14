import { FC } from 'react';
import { Link } from 'react-router-dom';

type BasicSelectorProps = {
    values: [string, string][];
    value: string | null;
    updateValue: (value: string) => void;
    label: string;
};

const BasicSelector: FC<BasicSelectorProps> = ({
    label,
    ...props
}: BasicSelectorProps) => (
    <>
        {' '}
        <label htmlFor={label}>{label}</label>
        <select
          id={label}
          onChange={(e) => props.updateValue(e.target.value)}
          value={props.value ?? ''}
        >
            {props.values.map(([value, text]) => (
                <option key={value} value={value}>
                    {text}
                </option>
            ))}
        </select>
    </>
);

export { BasicSelector };
