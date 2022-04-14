import { EventFilter } from '@ethersproject/contracts'
import { Provider } from '@ethersproject/providers'

export const logEvent = (provider: Provider | undefined, filter: EventFilter) =>
  new Promise((resolve) => {
    function callback(args: unknown) {
      provider?.removeListener(filter, callback)
      resolve(args)
    }
    provider?.on(filter, callback)
  })
