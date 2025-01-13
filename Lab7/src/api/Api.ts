/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Decree {
  /** ID */
  id?: number;
  /** Owner */
  owner?: string;
  /** Moderator */
  moderator?: string;
  /** Units */
  units?: string;
  /** Статус */
  status?: 1 | 2 | 3 | 4 | 5;
  /**
   * Дата создания
   * @format date-time
   */
  date_created?: string | null;
  /**
   * Дата формирования
   * @format date-time
   */
  date_formation?: string | null;
  /**
   * Дата завершения
   * @format date-time
   */
  date_complete?: string | null;
  /** Name */
  name?: string | null;
  /** Description */
  description?: string | null;
  /**
   * Дата
   * @format date
   */
  date?: string | null;
}

export interface UnitDecree {
  /** ID */
  id?: number;
  /** Совещание */
  meeting?: boolean;
  /** Unit */
  unit?: number | null;
  /** Decree */
  decree?: number | null;
}

export interface UserLogin {
  /**
   * Username
   * @minLength 1
   */
  username: string;
  /**
   * Password
   * @minLength 1
   */
  password: string;
}

export interface UserRegister {
  /** ID */
  id?: number;
  /**
   * Адрес электронной почты
   * @format email
   * @maxLength 254
   */
  email?: string;
  /**
   * Пароль
   * @minLength 1
   * @maxLength 128
   */
  password: string;
  /**
   * Имя пользователя
   * Обязательное поле. Не более 150 символов. Только буквы, цифры и символы @/./+/-/_.
   * @minLength 1
   * @maxLength 150
   * @pattern ^[\w.@+-]+$
   */
  username: string;
}

export interface User {
  /** ID */
  id?: number;
  /**
   * Адрес электронной почты
   * @format email
   * @maxLength 254
   */
  email?: string;
  /**
   * Имя пользователя
   * Обязательное поле. Не более 150 символов. Только буквы, цифры и символы @/./+/-/_.
   * @minLength 1
   * @maxLength 150
   * @pattern ^[\w.@+-]+$
   */
  username: string;
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "http://localhost:8000/api" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Snippets API
 * @version v1
 * @license BSD License
 * @termsOfService https://www.google.com/policies/terms/
 * @baseUrl http://localhost:8000/api
 * @contact <contact@snippets.local>
 *
 * Test description
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  decrees = {
    /**
     * No description
     *
     * @tags decrees
     * @name DecreesList
     * @request GET:/decrees/
     * @secure
     */
    decreesList: (
      query?: {
        status?: number;
        date_formation_start?: string;
        date_formation_end?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/decrees/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags decrees
     * @name DecreesRead
     * @request GET:/decrees/{decree_id}/
     * @secure
     */
    decreesRead: (decreeId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/decrees/${decreeId}/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags decrees
     * @name DecreesDeleteDelete
     * @request DELETE:/decrees/{decree_id}/delete/
     * @secure
     */
    decreesDeleteDelete: (decreeId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/decrees/${decreeId}/delete/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags decrees
     * @name DecreesDeleteUnitDelete
     * @request DELETE:/decrees/{decree_id}/delete_unit/{unit_id}/
     * @secure
     */
    decreesDeleteUnitDelete: (decreeId: string, unitId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/decrees/${decreeId}/delete_unit/${unitId}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags decrees
     * @name DecreesUnitsRead
     * @request GET:/decrees/{decree_id}/units/{unit_id}/
     * @secure
     */
    decreesUnitsRead: (decreeId: string, unitId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/decrees/${decreeId}/units/${unitId}/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags decrees
     * @name DecreesUpdateUpdate
     * @request PUT:/decrees/{decree_id}/update/
     * @secure
     */
    decreesUpdateUpdate: (decreeId: string, data: Decree, params: RequestParams = {}) =>
      this.request<Decree, any>({
        path: `/decrees/${decreeId}/update/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags decrees
     * @name DecreesUpdateStatusAdminUpdate
     * @request PUT:/decrees/{decree_id}/update_status_admin/
     * @secure
     */
    decreesUpdateStatusAdminUpdate: (decreeId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/decrees/${decreeId}/update_status_admin/`,
        method: "PUT",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags decrees
     * @name DecreesUpdateStatusUserUpdate
     * @request PUT:/decrees/{decree_id}/update_status_user/
     * @secure
     */
    decreesUpdateStatusUserUpdate: (decreeId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/decrees/${decreeId}/update_status_user/`,
        method: "PUT",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags decrees
     * @name DecreesUpdateUnitUpdate
     * @request PUT:/decrees/{decree_id}/update_unit/{unit_id}/
     * @secure
     */
    decreesUpdateUnitUpdate: (decreeId: string, unitId: string, data: UnitDecree, params: RequestParams = {}) =>
      this.request<UnitDecree, any>({
        path: `/decrees/${decreeId}/update_unit/${unitId}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  units = {
    /**
     * No description
     *
     * @tags units
     * @name UnitsList
     * @request GET:/units/
     * @secure
     */
    unitsList: (
      query?: {
        unit_name?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/units/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags units
     * @name UnitsCreateCreate
     * @request POST:/units/create/
     * @secure
     */
    unitsCreateCreate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/units/create/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags units
     * @name UnitsRead
     * @request GET:/units/{unit_id}/
     * @secure
     */
    unitsRead: (unitId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/units/${unitId}/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags units
     * @name UnitsAddToDecreeCreate
     * @request POST:/units/{unit_id}/add_to_decree/
     * @secure
     */
    unitsAddToDecreeCreate: (unitId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/units/${unitId}/add_to_decree/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags units
     * @name UnitsDeleteDelete
     * @request DELETE:/units/{unit_id}/delete/
     * @secure
     */
    unitsDeleteDelete: (unitId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/units/${unitId}/delete/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags units
     * @name UnitsUpdateUpdate
     * @request PUT:/units/{unit_id}/update/
     * @secure
     */
    unitsUpdateUpdate: (unitId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/units/${unitId}/update/`,
        method: "PUT",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags units
     * @name UnitsUpdateImageCreate
     * @request POST:/units/{unit_id}/update_image/
     * @secure
     */
    unitsUpdateImageCreate: (unitId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/units/${unitId}/update_image/`,
        method: "POST",
        secure: true,
        ...params,
      }),
  };
  users = {
    /**
     * No description
     *
     * @tags users
     * @name UsersLoginCreate
     * @request POST:/users/login/
     * @secure
     */
    usersLoginCreate: (data: UserLogin, params: RequestParams = {}) =>
      this.request<UserLogin, any>({
        path: `/users/login/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersLogoutCreate
     * @request POST:/users/logout/
     * @secure
     */
    usersLogoutCreate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/users/logout/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersRegisterCreate
     * @request POST:/users/register/
     * @secure
     */
    usersRegisterCreate: (data: UserRegister, params: RequestParams = {}) =>
      this.request<UserRegister, any>({
        path: `/users/register/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersUpdateUpdate
     * @request PUT:/users/{user_id}/update/
     * @secure
     */
    usersUpdateUpdate: (userId: string, data: User, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/users/${userId}/update/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
