import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
  // 1. Estado interno: tenta ler do localStorage, senão usa initialValue
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue; // SSR-safe
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // 2. Efeito: sempre que `value` mudar, grava no localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // opcional: lidar com quota exceeded
      console.warn('Não foi possível salvar no localStorage');
    }
  }, [key, value]);

  return [value, setValue] as const; // tupla [valor, setValor]
}