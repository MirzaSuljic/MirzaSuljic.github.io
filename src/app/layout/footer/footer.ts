import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PROFILE } from '../../data/profile';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.html',
})
export class Footer {
  protected readonly profile = PROFILE;
  protected readonly year = new Date().getFullYear();
}
