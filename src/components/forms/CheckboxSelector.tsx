import { FC } from 'react';
import { Link } from 'react-router-dom';

type BasicSelectorProps = {
    values: [string, string][];
    selectedValues: string[];
    updateValue: (values: string[]) => void;
    label: string;
};

const CheckboxSelector: FC<BasicSelectorProps> = ({
    label,
    ...props
}: BasicSelectorProps) => {
    const handleChange = (id: string) => {
        if (props.selectedValues.find((s) => s === id)) {
            props.updateValue(props.selectedValues.filter((s) => s !== id));
        } else {
            props.updateValue([...props.selectedValues, id]);
        }
    };

    return (
        <>
            {' '}
            <label htmlFor={label}>{label}</label>
            <table>
                <tbody>
                    {props.values.map((val) => (
                        <tr key={val[0]}>
                            <td>
                                <input
                                  id={label + val[0]}
                                  type="checkbox"
                                  onChange={() => handleChange(val[0])}
                                  checked={props.selectedValues.includes(
                                        val[0],
                                    )}
                                />
                            </td>
                            <td>
                                <label htmlFor={label + val[0]}>{val[1]}</label>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export { CheckboxSelector };
