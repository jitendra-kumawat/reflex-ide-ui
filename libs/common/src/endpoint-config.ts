export interface EndPointConfig {
    id?: string;
    baseUrl?: string;
    contextRoot?: string;
    method?: 'DELETE' | 'GET' | 'HEAD' | 'JSONP' | 'OPTIONS' | 'POST' | 'PUT' | 'PATCH'
    apiName?: string;
    request?: any;
    serviceRoot?: string;
    urlId?: any;
    [key: string]: any;
}
