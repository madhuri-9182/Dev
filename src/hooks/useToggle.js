import useLocalStorage from "./useLocalStorage";

const useToggle = (key, initValue) => {
  // Ensure initValue is boolean
  const initialBoolean = Boolean(initValue);

  const [value, setValue] = useLocalStorage(
    key,
    initialBoolean
  );

  const toggle = (newValue) => {
    setValue((prev) => {
      return typeof newValue === "boolean"
        ? newValue
        : !prev;
    });
  };

  return [value, toggle];
};

export default useToggle;
