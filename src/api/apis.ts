import { npoolapi } from 'src/npoolstore'

const api = npoolapi.useNpoolAPIStore()
export const getAPIs = (offset: number, limit: number) => {
  api.getAPIs({
    // Exported: true,
    // Depracated: false,
    Offset: offset,
    Limit: limit,
    Message: {}
  }, (error: boolean, rows?: Array<npoolapi.API>) => {
    if (error || !rows?.length) {
      return
    }
    getAPIs(offset + limit, limit)
  })
}

export const updateAPI = (row: npoolapi.API, done: (error: boolean) => void) => {
  api.updateAPI({
    ID: row.ID,
    EntID: row.EntID,
    Deprecated: row.Deprecated,
    Message: {
    }
  }, (error: boolean) => {
    done(error)
  })
}
