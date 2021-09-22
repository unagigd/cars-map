import { useEffect, useRef } from "react";

const useMovingPoints = (onUpdate) => {
  const updateHandlerRef = useRef();
  updateHandlerRef.current = onUpdate;

  useEffect(() => {
    const sse = new EventSource("http://localhost:3002/points");

    sse.onmessage = (e) => {
      updateHandlerRef.current(JSON.parse(e.data));
    };

    sse.onerror = () => {
      sse.close();
    };
    return () => {
      sse.close();
    };
  }, [onUpdate]);
};

export default useMovingPoints;
