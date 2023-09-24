import { AppID as myAppID } from 'src/const/const'
import { sdk } from 'src/npoolstore'

export * from 'src/npoolstore/sdk/localapp'
sdk.MyAppID.value = myAppID
export const AppID = sdk.AppID
