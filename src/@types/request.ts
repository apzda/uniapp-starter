export interface Response {
  data: any;
  statusCode: number;
  header: { [key: string]: string };
  cookies?: string[]
}

export interface RequestOptions {
  [key: string]: any

  url?: string;
  method?: 'GET' | 'POST';
  header?: { [key: string]: string };
  data?: any,
  timeout?: number;
  dataType?: string;
  responseType?: string;
  withCredentials?: boolean;
  showErrMsg?: false;
}

export interface CommonResponse<T = any> {
  errCode: number | string
  errMsg?: string
  data?: T
}

// 网络请求错误事件
export interface ErrorEvent {
  url?: string
  data?: CommonResponse
  suppress?: boolean
}

export type InternalRequestOptions = RequestOptions & {
  success: ((res: Response) => void)
  fail: ((err: CommonResponse) => void)
  complete: (() => void)
}

export type SuccessHandler<T> = (data: (CommonResponse<T> | PromiseLike<CommonResponse<T>>)) => void

export type RejectHandler = (error: CommonResponse) => void

