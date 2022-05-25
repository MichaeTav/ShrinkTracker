import { useState } from "react";
import moment from "moment";

export const useForm = (callback, initialState = {}) => {
  const [values, setValues] = useState(initialState);

  const onChange = (event, data) => {
    setValues({ ...values, [data.name]: data.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    callback();
  };

  const onClose = () => {
    setValues(initialState);
  };

  return {
    onChange,
    onSubmit,
    onClose,
    values,
  };
};

export const useShrinkForm = (callback, initialState = {}) => {
  const [values, setValues] = useState(initialState);

  const onChange = (event) => {
    if (event._d) {
      setValues({
        ...values,
        expirationDate: moment(event._d).format("YYYY-MM-DD"),
      });
    } else {
      setValues({ ...values, quantity: event.target.value });
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    callback();
  };

  const onClose = () => {
    setValues(initialState);
  };

  return {
    onChange,
    onSubmit,
    onClose,
    values,
  };
};
