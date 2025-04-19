import { Form as HeroUiForm } from "@heroui/form";

const Form = ({ method, action, children, onSubmit, className, validationBehavior = "native" }) => {
  return (
    <HeroUiForm
      method={method}
      action={action}
      className={className}
      validationBehavior={validationBehavior}
      onSubmit={(e) => {
        if (onSubmit) {
          e.preventDefault();
          const data = Object.fromEntries(new FormData(e.currentTarget));
          onSubmit(data);
        }
      }}
    >
      {children}
    </HeroUiForm>
  );
};

export default Form;
