import { EndPointConfig } from './endpoint-config';
import { RequestConfig } from '@guavus/auth';
import { UrlBuilder } from './url-builder';

export function getRequestConfig(endPointConfig: EndPointConfig, urlbuilder: UrlBuilder): RequestConfig {
  return {
    url: urlbuilder ? urlbuilder.getUrl(endPointConfig) : endPointConfig.baseUrl + endPointConfig.apiName,
    headers: endPointConfig.headers,
    payload: undefined
  };
}
