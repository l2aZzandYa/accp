import { useState, useEffect } from "react";

const get = (key, defaultValue) => {
    const saved = localStorage.getItem(key),
        initial = JSON.parse(saved);
        return initial || defaultValue;
}, useLocalStorage = (key, defaultValue) => {
    const [value, setValue] = useState(() => {
        return get(key, defaultValue);
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
};

export default useLocalStorage;