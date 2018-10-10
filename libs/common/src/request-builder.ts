import { EndPointConfig } from './endpoint-config';
import { ProjectConfig } from './project-config';

export namespace RequestBuilder {

  export function getUrl(endPointConfig: EndPointConfig, projectConfig: ProjectConfig): string {
    const serviceRoot = endPointConfig.serviceRoot;
    let baseURL = '';
    let baseUrlFromUrlId = '';
    const urls = projectConfig.urls || { base: projectConfig.baseUrl };
    const urlId = endPointConfig.urlId || 'base';

    baseUrlFromUrlId = urls[urlId] || projectConfig.baseUrl;
    baseURL = endPointConfig.baseUrl || baseUrlFromUrlId;

    const contextRoot = endPointConfig.contextRoot || projectConfig.contextRoot;
    const authToken = endPointConfig.authToken;
    let url = baseURL + contextRoot;
    if (serviceRoot !== undefined) {
      url += serviceRoot;
    }
    const api = endPointConfig.apiName;
    if (api !== undefined) {
      url += api;
    }
    if (authToken !== undefined) {
      url += authToken;
    }
    return url;
  }
}
