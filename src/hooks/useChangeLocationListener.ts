import { useEffect } from "react";
import {
  Location,
  useLocation
} from "react-router-dom";

export const useChangeLocationListener = (callback: () => void) => {
  const location: Location = useLocation();

  useEffect(() => {if(location.key !== 'default') callback()}, [callback, location]);
};