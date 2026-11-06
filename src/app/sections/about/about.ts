import { ChangeDetectionStrategy, Component } from '@angular/core';

import { EXPERIENCE } from '../../data/experience';
import { PROFILE } from '../../data/profile';
import type { Fact } from '../../models';
import { SectionHeading } from '../../shared/section-heading/section-heading';
import { yearsSince } from '../../utils/dates';

@Component({
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeading],
  templateUrl: './about.html',
})
export class About {
  protected readonly paragraphs = PROFILE.about;
  protected readonly facts: Fact[] = [
    { value: `${yearsSince(PROFILE.careerStart)}+`, label: 'years building software' },
    { value: `${yearsSince(EXPERIENCE[0].start)}`, label: 'years leading Angular development' },
    { value: '3', label: 'platforms shipped to production: web and Android' },
    { value: `${EXPERIENCE.length}`, label: 'companies, from support desk to tech lead' },
  ];
}
