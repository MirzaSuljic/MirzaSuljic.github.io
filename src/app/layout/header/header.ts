import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { PROFILE } from '../../data/profile';
import { BUTTON } from '../../shared/buttons';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  templateUrl: './header.html',
  host: { '(document:keydown.escape)': 'open.set(false)' },
})
export class Header {
  protected readonly profile = PROFILE;
  protected readonly button = BUTTON;
  protected readonly open = signal(false);
  protected readonly links = [
    { href: '#about', label: 'About' },
    { href: '#experience', label: 'Experience' },
    { href: '#projects', label: 'Projects' },
    { href: '#skills', label: 'Skills' },
    { href: '#contact', label: 'Contact' },
  ];
}
