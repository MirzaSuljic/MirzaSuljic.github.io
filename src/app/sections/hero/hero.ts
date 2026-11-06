import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PROFILE } from '../../data/profile';
import { BUTTON } from '../../shared/buttons';
import { Icon } from '../../shared/icon/icon';
import { yearsSince } from '../../utils/dates';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  templateUrl: './hero.html',
})
export class Hero {
  protected readonly profile = PROFILE;
  protected readonly button = BUTTON;
  protected readonly years = yearsSince(PROFILE.careerStart);
}
