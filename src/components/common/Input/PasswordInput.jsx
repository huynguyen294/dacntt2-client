import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

const PasswordInput = ({
  isDisabled,
  isRequired,
  isInvalid,
  errorMessage,
  label,
  name,
  onBlur,
  placeholder,
  variant,
  defaultValue,
  className,
  labelPlacement,
  autoComplete,
  ...otherProps
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const mainProps = {
    isDisabled,
    labelPlacement,
    onBlur,
    isRequired,
    isInvalid,
    errorMessage,
    label,
    name,
    placeholder,
    variant,
    className,
    defaultValue,
    autoComplete,
  };

  return (
    <Input
      {...mainProps}
      {...otherProps}
      type={isVisible ? "text" : "password"}
      endContent={
        <Button isIconOnly size="sm" variant="light" onPress={toggleVisibility}>
          {isVisible ? <Eye size="15px" /> : <EyeOff size="15px" />}
        </Button>
      }
    />
  );
};

export default PasswordInput;
