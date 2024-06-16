import {DependencyList, EffectCallback, useEffect} from "react";
import {AsyncEffectCallback} from "../types/AsyncEffectCallback";

const useAsyncEffect = (effect: AsyncEffectCallback, deps?: DependencyList) => {
  useEffect(() => {
    (async () => {
      effect();
    })()
  }, deps)
}

export { useAsyncEffect };
