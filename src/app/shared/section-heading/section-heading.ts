import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-section-heading',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './section-heading.html',
})
export class SectionHeading {
  readonly index = input.required<string>();
  readonly label = input.required<string>();
  readonly headingId = input.required<string>();
}
