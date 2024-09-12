import { useMemo, useState } from "react";


export function useReactState<T extends object>(initialState: T) {
    const [, setState] = useState(initialState);

    const proxy = useMemo(() => {
        return new Proxy<T>(initialState, {
            set: (obj: T, prop: PropertyKey, value) => {
                obj[prop as keyof T] = value;
                setState(value);
                return true;
            }
        }) as T;
    }, [initialState]);

    return proxy;
}