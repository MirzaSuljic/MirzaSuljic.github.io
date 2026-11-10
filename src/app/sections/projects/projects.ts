import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { GithubProjects } from '../../data/github-projects';
import { PROFILE } from '../../data/profile';
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
  private readonly githubProjects = inject(GithubProjects);

  /** hand-written projects plus every public GitHub repo, newest first */
  protected readonly projects = this.githubProjects.projects;
  protected readonly github = PROFILE.github;
  protected readonly button = BUTTON;

  constructor() {
    this.githubProjects.load();
  }
}
