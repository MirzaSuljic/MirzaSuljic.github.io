import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PROFILE } from '../../data/profile';
import { PROJECTS } from '../../data/projects';
import { BUTTON } from '../../shared/buttons';
import { Icon } from '../../shared/icon/icon';
import { SectionHeading } from '../../shared/section-heading/section-heading';

@Component({
  selector: 'app-projects',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, SectionHeading],
  templateUrl: './projects.html',
})
export class Projects {
  protected readonly projects = PROJECTS;
  protected readonly github = PROFILE.github;
  protected readonly button = BUTTON;
}
