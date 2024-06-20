export interface Job {
  id: string
  name: string
  title: string
  level: number
  icon?: string
  current?: true
}

export interface Department {
  id: string
  name: string
  desc?: string
  icon?: string
  current?: true
  jobs?: { [id: string]: Job }
}

export interface Organization {
  id: string
  name: string
  desc?: string
  icon?: string
  current?: true
  departments?: { [id: string]: Department }
}

export interface Tenant {
  id: string
  name: string
  current?: true
  organizations?: { [id: string]: Organization }
}

export interface Role {
  id: string
  name: string
  role: string
}

export interface UserInfo {
  [key: string]: any

  uid?: string | number
  uuid?: string
  name?: string
  displayName?: string
  firstName?: string
  lastName?: string
  status?: string
  login?: boolean
  lastLoginTime?: number
  lastLoginIp?: string
  phone?: string
  phonePrefix?: string
  email?: string
  provider?: string
  avatar?: string
  timezone?: string
  theme?: string
  lang?: string
  accessToken?: string
  refreshToken?: string
  mfa?: string
  locked?: boolean
  credentialsExpired?: boolean
  runAs?: string
  authorities?: string[]
  roles?: Role[]
  tenants?: { [id: string]: Tenant }
  tenant?: Tenant
  organization?: Organization
  department?: Department
  job?: Job
}


