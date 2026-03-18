import { hydrate, type ResolvedRegister, type State } from '@wagmi/core'
import { merge, onSettled, type ParentProps } from 'solid-js'

export type HydrateProps = {
  config: ResolvedRegister['config']
  initialState?: State | undefined
  reconnectOnMount?: boolean | undefined
}

export function Hydrate(parameters: ParentProps<HydrateProps>) {
  const props = merge({ reconnectOnMount: true }, parameters)

  const { onMount: hydrateOnMount } = hydrate(props.config, {
    initialState: props.initialState,
    reconnectOnMount: props.reconnectOnMount,
  })

  // Hydrate for non-SSR
  if (!props.config._internal.ssr) hydrateOnMount()

  onSettled(() => {
    if (!props.config._internal.ssr) return
    hydrateOnMount()
  })

  return props.children
}
