import { miningpoolpool } from 'src/npoolstore'

const poolInfo = miningpoolpool.useMiningpoolPoolStore()
export const getPools = (offset: number, limit: number) => {
  poolInfo.getPools({
    // Exported: true,
    // Depracated: false,
    Offset: offset,
    Limit: limit,
    Message: {}
  }, (error: boolean, rows?: Array<miningpoolpool.Pool>) => {
    if (error || !rows?.length) {
      return
    }
    getPools(offset + limit, limit)
  })
}

// export const updateAPI = (row: miningpoolapppool.API, done: (error: boolean) => void) => {
//   api.updateAPI({
//     ID: row.ID,
//     EntID: row.EntID,
//     Deprecated: row.Deprecated,
//     Message: {
//     }
//   }, (error: boolean) => {
//     done(error)
//   })
// }
