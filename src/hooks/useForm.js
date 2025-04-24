import { useCallback, useEffect, useRef, useState } from "react";
import useValidateForm from "./useValidateForm";

const defaultOptions = {
  defaultValues: {},
};

const useForm = (options = defaultOptions) => {
  const { defaultValues } = options;
  const { changeError, errors, changeErrors, clearError, clearErrors, isError } = useValidateForm();
  const [isDirty, setIsDirty] = useState(false);
  const formState = useRef({});
  const initState = useRef(defaultValues);
  const ref = useRef();

  const setFormState = useCallback(
    (newFormState) => {
      formState.current = newFormState;
      const newDirty = compareDirty(newFormState, initState.current);
      if (newDirty !== isDirty) setIsDirty(newDirty);
    },
    [isDirty]
  );

  const reset = useCallback(() => {
    setIsDirty(false);
    clearErrors();
    ref.current.reset();
    formState.current = initState.current;
  }, [clearErrors]);

  const getFormState = useCallback((field) => (field ? formState.current[field] : formState.current), []);
  const getDefaultValues = useCallback(() => initState.current, []);
  const instantChange = useCallback(
    () => setTimeout(() => ref.current.dispatchEvent(new Event("input", { bubbles: true }))),
    []
  );

  useEffect(() => {
    if (ref.current) {
      const data = Object.fromEntries(new FormData(ref.current));
      initState.current = { ...data, ...defaultValues };
    }
  }, [defaultValues]);

  return {
    ref,
    isDirty,
    isError,
    errors,
    actions: {
      instantChange,
      getDefaultValues,
      getFormState,
      setFormState,
      changeError,
      changeErrors,
      clearError,
      clearErrors,
      reset,
    },
  };
};

const compareDirty = (defaultObj, currentObj) => {
  let dirty = false;

  Object.keys(currentObj).forEach((key) => {
    if (!(key in defaultObj) || dirty) return;

    const currentValue = currentObj[key];
    const defaultValue = defaultObj[key];

    if (typeof currentValue === "object") {
      if (compareDirty(defaultValue, currentValue)) {
        dirty = true;
      }
    } else {
      if (currentValue !== defaultValue) {
        dirty = true;
      }
    }
  });

  return dirty;
};

export default useForm;
