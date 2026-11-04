import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useTimer
 * Accurate countdown timer using elapsed timestamps (avoids background tab drift)
 */
export function useTimer(initialSeconds = 3600, onExpire = () => {}) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const expireCallbackRef = useRef(onExpire);
  expireCallbackRef.current = onExpire;

  const endTimeRef = useRef(Date.now() + initialSeconds * 1000);

  const resetTimer = useCallback((newSeconds) => {
    const sec = newSeconds !== undefined ? newSeconds : initialSeconds;
    endTimeRef.current = Date.now() + sec * 1000;
    setTimeLeft(sec);
    setIsRunning(true);
  }, [initialSeconds]);

  const pauseTimer = useCallback(() => setIsRunning(false), []);
  const resumeTimer = useCallback(() => {
    endTimeRef.current = Date.now() + timeLeft * 1000;
    setIsRunning(true);
  }, [timeLeft]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.round((endTimeRef.current - Date.now()) / 1000));
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        setIsRunning(false);
        if (expireCallbackRef.current) {
          expireCallbackRef.current();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = useCallback((totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n) => String(n).padStart(2, '0');
    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}`;
  }, []);

  return {
    timeLeft,
    formattedTime: formatTime(timeLeft),
    isRunning,
    resetTimer,
    pauseTimer,
    resumeTimer,
  };
}

