import { FC } from 'react';
import { Link } from 'react-router-dom';

type StarRatioProps = {
    groupName: string;
    value?: number;
    updateValue: (value: number) => void;
};

const StarRatio: FC<StarRatioProps> = ({
    updateValue,
    value,
    groupName,
}: StarRatioProps) => {
    const rates = [1, 2, 3, 4, 5];

    return (
        <>
            {rates.map((rate) => (
                <label
                  htmlFor={groupName + rate.toString()}
                  key={rate.toString()}
                >
                    <input
                      id={groupName + rate.toString()}
                      type="radio"
                      value={rate}
                      checked={rate === value}
                      name={groupName}
                      onChange={() => updateValue(rate)}
                    />
                    {rate.toString()}
                </label>
            ))}
        </>
    );
};

export { StarRatio };
