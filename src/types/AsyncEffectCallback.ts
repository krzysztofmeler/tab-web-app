import { EffectCallback } from 'react';

type AsyncEffectCallback = EffectCallback | (() => Promise<void>);

export type { AsyncEffectCallback };
