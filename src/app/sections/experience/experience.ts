import { ChangeDetectionStrategy, Component } from '@angular/core';

import { EXPERIENCE } from '../../data/experience';
import { SectionHeading } from '../../shared/section-heading/section-heading';
import { formatPeriod } from '../../utils/dates';

@Component({
  selector: 'app-experience',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeading],
  templateUrl: './experience.html',
})
export class Experience {
  protected readonly jobs = EXPERIENCE;
  protected readonly period = formatPeriod;
}
