/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";

const Controller = ({ form, name, render = ({ value, setValue }) => null }) => {
  const [value, setValue] = useState();
  const ref = useRef();

  console.log(value);

  useEffect(() => {
    const unsubscribe = form.subscribe(name, (newValue) => {
      setValue(newValue);
      if (ref.current) ref.current.dispatchEvent(new Event("change"));
    });

    return unsubscribe;
  }, [name]);

  return render({ ref, name, value, setValue });
};

export default Controller;
