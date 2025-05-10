/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from "react";
import useValidateForm from "./useValidateForm";

const defaultOptions = {
  defaultValues: {},
  numberFields: [],
};

const useForm = (options = defaultOptions) => {
  const { defaultValues = defaultOptions.defaultValues, numberFields = defaultOptions.numberFields } = options;
  const { changeError, errors, changeErrors, clearError, clearErrors, isError } = useValidateForm();
  const [isDirty, setIsDirty] = useState(false);
  const formState = useRef({});
  const initState = useRef(defaultValues);
  const listenersRef = useRef({});
  const ref = useRef();

  const setFormState = useCallback(
    (newFormState) => {
      numberFields.forEach((field) => (newFormState[field] = +newFormState[field]));
      formState.current = newFormState;
      const newDirty = compareDirty(newFormState, initState.current);
      if (newDirty !== isDirty) setIsDirty(newDirty);
    },
    [isDirty]
  );

  const reset = useCallback(() => {
    setIsDirty(false);
    clearErrors();

    const listeners = listenersRef.current;
    const callbacks = Object.values(listeners);
    callbacks.forEach((cb) => cb(""));

    ref.current.reset();
    formState.current = initState.current;
  }, [clearErrors]);

  const getFormState = useCallback((field) => (field ? formState.current[field] : formState.current), []);
  const getDefaultValues = useCallback(() => initState.current, []);
  const instantChange = useCallback(
    () => setTimeout(() => ref.current.dispatchEvent(new Event("input", { bubbles: true }))),
    []
  );

  const subscribe = useCallback((name, callback) => {
    const listeners = listenersRef.current;
    listeners[name] = callback;

    return () => (listeners[name] = null);
  }, []);

  const setValue = useCallback(
    (field, value) => {
      const listeners = listenersRef.current;

      if (typeof field === "string") {
        const callback = listeners[field];
        if (!callback) {
          throw new Error(`${field} is uncontrolled, please use Controller for it!`);
        }

        callback(value);
        instantChange();
      }

      if (typeof field === "object") {
        Object.entries(field).forEach(([key, value]) => {
          const callback = listeners[key];
          if (!callback) {
            throw new Error(`${key} is uncontrolled, please use Controller for it!`);
          }

          callback(value);
        });

        instantChange();
      }
    },
    [instantChange]
  );

  useEffect(() => {
    if (ref.current) {
      const data = Object.fromEntries(new FormData(ref.current));
      numberFields.forEach((field) => (data[field] = +data[field]));
      initState.current = { ...data, ...defaultValues };
    }
  }, [defaultValues]);

  return {
    ref,
    isDirty,
    isError,
    errors,
    numberFields,
    subscribe,
    actions: {
      setValue,
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
