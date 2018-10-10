import { TestBed, async } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { Actions } from '@ngrx/effects';
import { cold } from 'jasmine-marbles';

import { ApplicationEffects } from './application.effects';
import { UserCountServcie } from '../landing-screen/user-count.service';
import { FetachUserCountSuccess, FetachUserCount, FetachUserCountFail } from './application.actions';

describe('ApplicationEffects', () => {
  let actions;
  let effects: ApplicationEffects;
  const service = jasmine.createSpyObj('UserCountServcie', ['fetch']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      providers: [ApplicationEffects, provideMockActions(() => actions), { provide: UserCountServcie, useValue: service } ]

    });

    effects = TestBed.get(ApplicationEffects);
  });

  describe('someEffect', () => {
    it('should dispatch FetachUserCountSuccess action on successful', async(async () => {
        const userCountServcie = TestBed.get(UserCountServcie);
        userCountServcie.fetch.and.returnValue(cold('--a|', { a: { count: 101 } }));

        const action = new FetachUserCount({url:"", headers: {}, payload:""});
        const completion = new FetachUserCountSuccess(101);

        actions = cold('-a', { a: action });

        const applicationEffects = new ApplicationEffects(new Actions(actions), userCountServcie);

        const expected = cold('---b', { b: completion });

        expect(applicationEffects.getUserCount$).toBeObservable(expected);

      })
    );

    xit('should dispatch FetachUserCountFail action on failure', async(async () => {
      const userCountServcie = TestBed.get(UserCountServcie);
      userCountServcie.fetch.and.returnValue(cold('---#|'));

      const action = new FetachUserCount({url:"", headers: {}, payload:""});
      const completion = new FetachUserCountFail();

      actions = cold('-a', { a: action });

      const applicationEffects = new ApplicationEffects(new Actions(actions), userCountServcie);

      const expected = cold('---b', { b: completion });

      expect(applicationEffects.getUserCount$).toBeObservable(expected);

    })
  );


  });
});
