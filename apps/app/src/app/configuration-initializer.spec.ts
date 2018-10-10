import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, async } from '@angular/core/testing';
import { appConfig, ISOFFLINE, OFFLINE_LOGIN_DATA } from '@reflex-ide/common';
import {} from 'jasmine'
import { ConfigurationInitializer } from './configuration-initializer';

describe('ConfigurationInitializer::', () => {
  let initializer:ConfigurationInitializer;
  let httpMock:HttpTestingController;
  let original_app_config;

  beforeEach( () => {
    TestBed.configureTestingModule( {
      imports: [HttpClientTestingModule],
      providers: [ConfigurationInitializer]
    });
    initializer = TestBed.get(ConfigurationInitializer);
    httpMock = TestBed.get(HttpTestingController);
  });

  beforeAll(() => original_app_config = Object.assign({},appConfig));

  afterEach( () => {
    httpMock.verify();
  })

  afterAll(() => {
     for (const key of Object.keys(original_app_config)) {
        appConfig[key] = original_app_config[key]
     }
  });

  it('instantiation should be correct', () => {
    expect(initializer).toBeTruthy();
  })

  it('getFilePath should retun correct default path', () => {
    const filepath = initializer.getFilePath('default.json')
    expect(filepath).toEqual('./config/default.json')
  })

  it('getFilePath should retun correct path for login.json', () => {
    const filepath = initializer.getFilePath('login.json')
    expect(filepath).toEqual('./data/login.json')
  })

  it('onResolved  should insert correct value in app-config for new files', () => {
    appConfig['test'] = undefined;
    const filepath = initializer.onResolved('test.json', {"name": "Arpit"})
    expect(appConfig['test']).toEqual({"name": "Arpit"});
  })
  it('onResolved  should insert correct value in offline-data for login', () => {
    const old_offline_login_data = OFFLINE_LOGIN_DATA.data;
    const login_data = initializer.onResolved('login.json', {"name": "Arpit"})
    expect(OFFLINE_LOGIN_DATA.data).toEqual({"name": "Arpit"});
    OFFLINE_LOGIN_DATA.data = old_offline_login_data;
  })

  it('onResolved  should insert correct value in app-config for config.json', () => {
    const old_project = appConfig.project;
    appConfig.project = undefined;
    const filepath = initializer.onResolved('config.json', {"appName": "Arpit"})
    expect(appConfig.project).toBeDefined();
    expect(appConfig.project.offline).toEqual(ISOFFLINE);
    expect(appConfig.project).toEqual({"appName": "Arpit", offline: ISOFFLINE});
    appConfig.project = old_project;
  })

  it('run', async(() => {
    let files_count = initializer.files.length;
    const old_file_paths = [].concat(initializer.files);
    initializer.files.splice(1,files_count-1);
    expect(initializer.files.length).toEqual(1);
    const aboutResponse = {"about": true};
    const loginResponse = {"login": true};

    initializer.run().then(() => {
      expect(appConfig.about).toEqual(aboutResponse);
      if(ISOFFLINE) {
        expect(OFFLINE_LOGIN_DATA.data).toEqual(loginResponse);
      }
    })

    const aboutPath = initializer.getFilePath('about.json');
    const aboutRequest = httpMock.expectOne(aboutPath);
    expect(aboutRequest.request.method).toBe("GET");
    aboutRequest.flush(aboutResponse);

    files_count = 1;
    if(ISOFFLINE) {
      const loginpath = initializer.getFilePath('login.json');
      const loginRequest = httpMock.expectOne(loginpath);
      expect(loginRequest.request.method).toBe("GET");
      loginRequest.flush(loginResponse);
      files_count++;
    }

    // sanitization for out of order
    expect(initializer.files.length).toEqual(files_count);
    initializer.files.splice(0,files_count, ...old_file_paths);
    expect(initializer.files.length).toEqual(old_file_paths.length);
  }))

});
