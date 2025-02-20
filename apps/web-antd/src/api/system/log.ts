import type { Recordable } from '@vben/types'

import { requestClient } from '#/api/request'

export const logApi = {
  list: (params: Recordable<any>) => {
    return requestClient.get('/logs', { params })
  },
}
