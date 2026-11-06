import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CERTIFICATIONS, EDUCATION } from '../../data/education';
import { SKILLS } from '../../data/skills';
import { SectionHeading } from '../../shared/section-heading/section-heading';

@Component({
  selector: 'app-skills',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeading],
  templateUrl: './skills.html',
})
export class Skills {
  protected readonly groups = SKILLS;
  protected readonly education = EDUCATION;
  protected readonly certifications = CERTIFICATIONS;
}
