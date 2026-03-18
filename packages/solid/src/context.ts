import type { ResolvedRegister, State } from '@wagmi/core'
import {
  createComponent,
  createContext,
  merge,
  type ParentProps,
} from 'solid-js'
import { Hydrate } from './hydrate.js'

export const WagmiContext = createContext<
  ResolvedRegister['config'] | undefined
>(undefined)

export type WagmiProviderProps = {
  config: ResolvedRegister['config']
  initialState?: State | undefined
  reconnectOnMount?: boolean | undefined
}

export function WagmiProvider(parameters: ParentProps<WagmiProviderProps>) {
  const props = merge({ reconnectOnMount: true }, parameters)
  return createComponent(Hydrate, {
    get config() {
      return props.config
    },
    get initialState() {
      return props.initialState
    },
    get reconnectOnMount() {
      return props.reconnectOnMount
    },
    get children() {
      return createComponent(WagmiContext, {
        get value() {
          return props.config
        },
        get children() {
          return props.children
        },
      })
    },
  })
}
