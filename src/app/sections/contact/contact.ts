import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PROFILE } from '../../data/profile';
import { BUTTON } from '../../shared/buttons';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  templateUrl: './contact.html',
})
export class Contact {
  protected readonly profile = PROFILE;
  protected readonly button = BUTTON;
}
