import { getUserDetails } from '@/actions/user'
import { MenuOptions } from './menu-options'

type Props = {
  id: string
  type: 'agency' | 'subAccount'
}

export const Sidebar = async ({ id, type }: Props) => {
  const user = await getUserDetails()

  if (!user) {
    return null
  }

  const details =
    type === 'agency'
      ? user.agency
      : user.agency?.subAccount.find((subAccount) => subAccount.id === id)

  const isWhiteLabeledAgency = user.agency?.whiteLabel

  if (!details) {
    return
  }

  let sidebarLogo = user.agency?.agencyLogo || '/assets/plura-logo.svg'

  if (!isWhiteLabeledAgency) {
    if (type === 'subAccount') {
      sidebarLogo =
        user.agency?.subAccount.find((subAccount) => subAccount.id === id)?.subAccountLogo ||
        user.agency?.agencyLogo!
    }
  }

  const sidebarOpt =
    type === 'agency'
      ? user.agency?.sidebarOption || []
      : user.agency?.subAccount.find((subAccount) => subAccount.id === id)?.sidebarOption || []

  const subAccounts = user.agency?.subAccount.filter((subAccount) =>
    user.permissions.find(
      (permission) => permission.subAccountId === subAccount.id && permission.access,
    ),
  )

  return (
    <>
      <MenuOptions
        defaultOpen
        details={details}
        id={id}
        sidebarLogo={sidebarLogo}
        sidebarOpt={sidebarOpt}
        subAccounts={subAccounts}
        user={user}
      />
    </>
  )
}
