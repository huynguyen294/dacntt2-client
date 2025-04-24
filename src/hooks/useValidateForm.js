import { useCallback, useMemo, useState } from "react";

const useValidateForm = () => {
  const [errors, setErrors] = useState({});

  const isError = useMemo(() => Object.keys(errors).length > 0, [errors]);

  const changeError = useCallback((field, errorMessage) => {
    setErrors((prev) => {
      if (prev[field] === errorMessage) return prev;
      return { ...prev, [field]: errorMessage };
    });
  }, []);

  const changeErrors = useCallback((errors) => {
    setErrors((prev) => ({ ...prev, ...errors }));
  }, []);

  const clearError = useCallback((field) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      return { ...prev, [field]: "" };
    });
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return { isError, errors, changeError, changeErrors, clearError, clearErrors };
};

export default useValidateForm;
