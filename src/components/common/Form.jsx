import { Form as HeroUiForm } from "@heroui/form";

const Form = ({
  method,
  form,
  action,
  children,
  onSubmit = () => {},
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
        onSubmit(data);
      }}
      onInput={(e) => {
        if (form) {
          const { actions } = form;
          const values = Object.fromEntries(new FormData(e.currentTarget));
          actions.setFormState(values);
        }
      }}
      {...other}
    >
      {children}
    </HeroUiForm>
  );
};

export default Form;
