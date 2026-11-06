import { Directive, input } from '@angular/core';

import { CV_NOTIFY_ENDPOINT, NO_TRACK_KEY } from '../../data/tracking';

/**
 * Sends a short Formspree notification when the CV link is clicked.
 * The download itself is never blocked: the request is fire-and-forget
 * and uses keepalive, so it still goes out while the PDF opens.
 */
@Directive({
  selector: 'a[appTrackCv]',
  host: { '(click)': 'notify()' },
})
export class TrackCv {
  /** Where on the page the button sits: header, hero or contact. */
  readonly appTrackCv = input.required<string>();

  protected notify(): void {
    if (isOptedOut()) return;

    // Also show the click as an event in GoatCounter stats.
    const gc = (window as { goatcounter?: { count?: (v: object) => void } }).goatcounter;
    gc?.count?.({ path: `cv-download-${this.appTrackCv()}`, title: 'Download CV', event: true });

    const body = new FormData();
    body.append('_subject', 'Portfolio: someone downloaded your CV');
    body.append('button', this.appTrackCv());
    body.append('time', new Date().toLocaleString('bs-BA', { timeZone: 'Europe/Sarajevo' }));
    body.append('came_from', document.referrer || 'direct / unknown');
    body.append('page', location.href);
    body.append('language', navigator.language);
    body.append('device', navigator.userAgent);

    fetch(CV_NOTIFY_ENDPOINT, {
      method: 'POST',
      body,
      headers: { Accept: 'application/json' },
      keepalive: true,
    }).catch(() => undefined);
  }
}

function isOptedOut(): boolean {
  try {
    if (new URLSearchParams(location.search).has('notrack')) {
      localStorage.setItem(NO_TRACK_KEY, '1');
    }
    return localStorage.getItem(NO_TRACK_KEY) === '1';
  } catch {
    return false;
  }
}
