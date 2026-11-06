import type { SkillGroup } from '../models';

export const SKILLS: SkillGroup[] = [
  {
    name: 'Frontend',
    skills: ['Angular', 'TypeScript', 'RxJS', 'NgRx', 'Signals', 'React', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS'],
  },
  { name: 'Mobile', skills: ['Kotlin', 'Jetpack Compose', 'Android SDK', 'R8 / ProGuard'] },
  { name: 'Backend & data', skills: ['Java', 'Spring Boot', 'REST APIs', 'PHP', 'MySQL', 'PostgreSQL'] },
  { name: 'Delivery', skills: ['GitLab CI/CD', 'GitHub Actions', 'Unit testing', 'Linting', 'Code review'] },
  { name: 'Platforms', skills: ['Linux', 'Windows', 'macOS', 'iOS', 'Android'] },
  { name: 'Beyond code', skills: ['Leading a team', 'Mentoring', 'Customer training', 'Technical support'] },
];
