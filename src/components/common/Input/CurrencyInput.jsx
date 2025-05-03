/* eslint-disable react-hooks/exhaustive-deps */
import { currencyToNumber } from "@/utils";
import { NumberInput } from "@heroui/number-input";
import { useEffect, useState } from "react";

const CurrencyInput = ({
  value,
  name,
  defaultValue,
  variant,
  classNames,
  startContent,
  onChange = () => {},
  onBlur = () => {},
  isClearable = true,
  ...other
}) => {
  const [currentValue, setCurrentValue] = useState(value || defaultValue);

  const handleBlur = (e) => {
    const value = typeof e === "number" ? e : currencyToNumber(e?.target?.value || 0);
    const event = { target: { value } };
    onBlur && onBlur(event);
  };

  const handleChange = (e) => {
    const value = typeof e === "number" ? e : currencyToNumber(e?.target?.value || 0);

    setCurrentValue(value);
    onChange({ target: { value } });
  };

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  useEffect(() => {
    if (defaultValue) {
      setCurrentValue(defaultValue);
      handleBlur(defaultValue);
    }
  }, [defaultValue]);

  return (
    <NumberInput
      aria-labelledby="number-input"
      isWheelDisabled
      name={name}
      value={currentValue || null}
      variant={variant}
      classNames={classNames}
      startContent={startContent || <p className="font-semibold text-foreground-500">VNĐ</p>}
      onClear={
        isClearable
          ? () => {
              handleBlur(null);
              handleChange(0);
            }
          : null
      }
      {...other}
      inputMode="numeric"
      onChange={handleChange}
      onValueChange={handleBlur}
      onBlur={handleBlur}
    />
  );
};

export default CurrencyInput;
