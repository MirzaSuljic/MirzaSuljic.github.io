import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Footer } from './layout/footer/footer';
import { Header } from './layout/header/header';
import { About } from './sections/about/about';
import { Contact } from './sections/contact/contact';
import { Experience } from './sections/experience/experience';
import { Hero } from './sections/hero/hero';
import { Projects } from './sections/projects/projects';
import { Skills } from './sections/skills/skills';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Header, Hero, About, Experience, Projects, Skills, Contact, Footer],
  templateUrl: './app.html',
})
export class App {}
