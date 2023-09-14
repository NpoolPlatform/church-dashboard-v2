import { AppID } from './app'
import { user, notify } from 'src/npoolstore'

const _user = user.useUserStore()
export const getAppUsers = (offset: number, limit: number) => {
  _user.getAppUsers({
    TargetAppID: AppID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_USERS',
        Message: 'MSG_GET_USERS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (resp: Array<user.User>, error: boolean) => {
    if (error || resp.length < limit) {
      return
    }
    getAppUsers(offset + limit, limit)
  })
}
