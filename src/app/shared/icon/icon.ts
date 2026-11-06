import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type IconName = 'github' | 'linkedin' | 'mail' | 'download' | 'arrow-right' | 'external' | 'pin' | 'menu' | 'close';

@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex shrink-0', 'aria-hidden': 'true' },
  templateUrl: './icon.html',
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly size = input(20);
}
