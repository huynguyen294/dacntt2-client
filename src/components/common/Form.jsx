import { Form as HeroUiForm } from "@heroui/form";

const Form = ({
  method,
  form,
  action,
  children,
  onSubmit = () => {},
  onInput = () => {},
  onChange = () => {},
  numberFields = [],
  className,
  validationBehavior = "native",
  ...other
}) => {
  return (
    <HeroUiForm
      ref={form?.ref}
      method={method}
      action={action}
      className={className}
      validationBehavior={validationBehavior}
      onSubmit={(e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget));
        (form?.numberFields || numberFields).forEach((field) => (data[field] = +data[field]));
        onSubmit(data);
      }}
      onInput={(e) => {
        onInput(e);
        if (form) {
          const formState = Object.fromEntries(new FormData(e.currentTarget));
          form.actions.setFormState(formState);
          onChange(formState);
        }
      }}
      {...other}
    >
      {children}
    </HeroUiForm>
  );
};

export default Form;
