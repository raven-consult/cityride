import React from "react";


export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const getUrl = (functionName: string) => {
  const name = functionName.toLowerCase();
  return `https://${name}-4guzujqpna-uc.a.run.app`;
}

// export const getUrl = (functionName: string) => {
//   const firebaseEmulatorHost = process.env.EXPO_PUBLIC_EMULATOR_HOST || "localhost";

//   if (__DEV__) {
//     return `http://${firebaseEmulatorHost}:5001/fillng-prod/us-central1/${functionName}`;
//   } else {
//     const name = functionName.toLowerCase();
//     return `https://${name}-4guzujqpna-uc.a.run.app`;
//   }
// }