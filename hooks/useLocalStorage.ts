"use client";

import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

/**
 * Estado persistido em localStorage, seguro para SSR.
 * - No servidor e no primeiro render do cliente usa `inicial` (sem divergência de hidratação).
 * - Após montar, lê o valor salvo e o valida com `validar`; dado inválido é ignorado.
 * - Só grava depois de hidratar, para não sobrescrever dados salvos com o valor inicial.
 */
export function useLocalStorage<T>(
  chave: string,
  inicial: T,
  validar: (valor: unknown) => valor is T,
): readonly [T, Dispatch<SetStateAction<T>>, boolean] {
  const [valor, setValor] = useState<T>(inicial);
  const [hidratado, setHidratado] = useState(false);

  useEffect(() => {
    try {
      const bruto = window.localStorage.getItem(chave);
      if (bruto !== null) {
        const lido: unknown = JSON.parse(bruto);
        if (validar(lido)) setValor(lido);
      }
    } catch {
      // JSON corrompido ou storage indisponível: mantém o valor inicial.
    }
    setHidratado(true);
  }, [chave, validar]);

  useEffect(() => {
    if (!hidratado) return;
    try {
      window.localStorage.setItem(chave, JSON.stringify(valor));
    } catch {
      // Cota excedida ou modo privado: o app continua funcionando em memória.
    }
  }, [chave, valor, hidratado]);

  return [valor, setValor, hidratado] as const;
}
