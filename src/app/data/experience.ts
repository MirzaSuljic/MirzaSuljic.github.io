import type { Job } from '../models';

export const EXPERIENCE: Job[] = [
  {
    company: 'ABC TECH Group',
    role: 'Software Development Engineer',
    start: '2021-03',
    end: null,
    location: 'Tuzla, Bosnia and Herzegovina',
    highlights: [
      'Lead Angular development of enterprise-grade web products, including an internet banking platform.',
      'Build UI features, form flows, validations and backend API integrations.',
      'Ship native Android features in Kotlin and Jetpack Compose in a modular, multi-feature banking app, using AI-assisted development for implementation and code review.',
      'Built and maintain the GitLab CI/CD pipelines for the Angular and Android apps: environment-specific builds, tag-driven versioning, artifact distribution and merge-request quality gates.',
      'Hardened Android release builds with R8/ProGuard, per-environment configuration and signing, fixing crashes caused by missing build-time configuration.',
    ],
    tech: ['Angular', 'TypeScript', 'RxJS', 'NgRx', 'Kotlin', 'Jetpack Compose', 'GitLab CI/CD'],
  },
  {
    company: 'Habultron d.o.o.',
    role: 'Software Development Engineer',
    start: '2019-04',
    end: '2020-12',
    location: 'Tuzla, Bosnia and Herzegovina',
    highlights: [
      'Developed and maintained production web applications with Angular on the front end and PHP on the back end.',
      'Delivered new features, bug fixes and ongoing maintenance.',
    ],
    tech: ['Angular', 'TypeScript', 'JavaScript', 'PHP', 'CodeIgniter', 'MySQL'],
  },
  {
    company: 'Bicom Systems',
    role: 'Deployment & Training Engineer',
    start: '2018-10',
    end: '2019-02',
    location: 'Tuzla, Bosnia and Herzegovina',
    highlights: [
      'Installed, configured and supported Bicom VoIP products on Linux servers.',
      'Validated patches and new releases on Windows, Linux, macOS, iOS and Android.',
      'Ran product training and best-practice sessions for customers and partners.',
    ],
    tech: ['Linux', 'VoIP', 'Release testing', 'Training'],
  },
  {
    company: 'Marvelsoft',
    role: 'Software Development Engineer',
    start: '2018-06',
    end: '2018-09',
    location: 'Tuzla, Bosnia and Herzegovina',
    highlights: ['Built front-end features and UI for client projects.'],
    tech: ['JavaScript', 'HTML', 'CSS'],
  },
  {
    company: 'Cape Ann Enterprises',
    role: 'Programmer',
    start: '2017-04',
    end: '2018-06',
    location: 'Remote',
    highlights: ['Built and maintained web solutions for multiple clients, from new features to existing codebases.'],
    tech: ['JavaScript', 'jQuery', 'Drupal'],
  },
];
