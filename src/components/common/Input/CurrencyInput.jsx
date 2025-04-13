/* eslint-disable react-hooks/exhaustive-deps */
import { ScrollArea, ScrollBar } from "@/components/shadcn";
import { cn } from "@/lib/utils";
import { currencyToNumber } from "@/utils";
import { NumberInput } from "@heroui/number-input";
import { Button } from "@heroui/button";
import { useEffect, useState } from "react";

const suggestionSteps = [10, 100, 1000, 10000, 100000];

const CurrencyInput = ({
  value,
  onChange,
  onBlur,
  defaultValue,
  register,
  variant,
  classNames,
  startContent,
  isClearable = true,
  ...other
}) => {
  const [currentValue, setCurrentValue] = useState(value || defaultValue);
  const [suggestions, setSuggestions] = useState([]);

  const handleBlur = (e) => {
    const value = typeof e === "number" ? e : currencyToNumber(e?.target?.value || 0);
    const event = { target: { value } };
    onBlur && onBlur(event);
  };

  const handleChange = (e) => {
    const value = typeof e === "number" ? e : currencyToNumber(e?.target?.value || 0);

    setCurrentValue(value);
    onChange({ target: { value } });

    // Suggestions
    if (value >= 0) {
      setSuggestions(
        suggestionSteps.reduce((acc, step) => {
          const suggest = value * step;
          if (suggest <= 100000000 && suggest >= 10000) acc.push(suggest);
          return acc;
        }, [])
      );
    }
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
    <div className={cn(classNames?.fieldWrapper)}>
      <NumberInput
        aria-labelledby="number-input"
        isWheelDisabled
        defaultValue={defaultValue}
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
        {...register}
        {...other}
        inputMode="numeric"
        onChange={handleChange}
        onValueChange={handleBlur}
        onBlur={handleBlur}
      />
      {suggestions.length > 0 && (
        <ScrollArea className="w-full max-w-full whitespace-nowrap">
          <div className="flex w-max gap-1 mt-1">
            {suggestions.map((v) => (
              <Button
                key={v}
                variant={variant}
                size="sm"
                className={cn(
                  "rounded-full border-default-200 shadow-sm",
                  !variant && "bg-default-100 hover:bg-default-200",
                  classNames?.suggestionButton
                )}
                onPress={() => {
                  handleChange(v);
                  handleBlur(v);
                }}
              >
                {v.toLocaleString("zh-CN")}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
    </div>
  );
};

export default CurrencyInput;
