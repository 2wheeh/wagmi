import {
  type Config,
  type ResolvedRegister,
  type WatchBlockNumberParameters,
  watchBlockNumber,
} from '@wagmi/core'
import type {
  ConfigParameter,
  EnabledParameter,
  UnionCompute,
  UnionExactPartial,
} from '@wagmi/core/internal'
import { type Accessor, createEffect } from 'solid-js'
import { useChainId } from './useChainId.js'
import { useConfig } from './useConfig.js'

/** https://wagmi.sh/solid/api/hooks/useWatchBlockNumber */
export function useWatchBlockNumber<
  config extends Config = ResolvedRegister['config'],
  chainId extends
    config['chains'][number]['id'] = config['chains'][number]['id'],
>(
  parameters: useWatchBlockNumber.Parameters<config, chainId> = () =>
    ({}) as any,
): useWatchBlockNumber.ReturnType {
  const config = useConfig(parameters)
  const configChainId = useChainId(() => ({ config: config() }))
  createEffect(
    () => ({
      params: parameters(),
      config: config(),
      configChainId: configChainId(),
    }),
    ({ params, config: _config, configChainId: _configChainId }) => {
      const {
        config: _,
        chainId = _configChainId,
        enabled = true,
        onBlockNumber,
        ...rest
      } = params
      if (!enabled) return
      if (!onBlockNumber) return
      const unwatch = watchBlockNumber(_config, {
        ...(rest as any),
        chainId,
        onBlockNumber,
      })
      return () => unwatch()
    },
  )
}

export namespace useWatchBlockNumber {
  export type Parameters<
    config extends Config = Config,
    chainId extends
      config['chains'][number]['id'] = config['chains'][number]['id'],
  > = Accessor<SolidParameters<config, chainId>>

  export type ReturnType = void

  export type SolidParameters<
    config extends Config = Config,
    chainId extends
      config['chains'][number]['id'] = config['chains'][number]['id'],
  > = UnionCompute<
    UnionExactPartial<WatchBlockNumberParameters<config, chainId>> &
      ConfigParameter<config> &
      EnabledParameter
  >
}
