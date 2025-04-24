import { useCallback, useState } from "react";

const useValidateForm = () => {
  const [errors, setErrors] = useState({});

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

  return { errors, changeError, changeErrors, clearError, clearErrors };
};

export default useValidateForm;
