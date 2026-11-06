# Mirza Suljić · Portfolio

My personal site: who I am, where I've worked, what I build, and my CV to download.

Live at **https://mirzasuljic.github.io**

Built with Angular 21 and Tailwind CSS 4, and published to GitHub Pages by GitHub Actions on every push to `main`.

## What's on the page

| Section | Content |
|---|---|
| Hero | Name, title, a one-line summary, photo, links to projects, CV, GitHub, LinkedIn and email |
| About | A short introduction and four key numbers; years of experience are calculated from the start date |
| Experience | Every role with dates, highlights and technologies |
| Projects | Side projects with a description, technologies, code and live demo links |
| Skills & education | Skills grouped by area, degree and certification |
| Contact | Email, LinkedIn, GitHub and the CV |

## Tech stack

| Area | Choice |
|---|---|
| Framework | Angular 21: standalone components, signals, built-in control flow, zoneless change detection |
| Styling | Tailwind CSS 4, with the theme in `src/styles.css` |
| Content | Typed data in `src/app/data/`, one model per file in `src/app/models/` |
| Tests | Vitest through the Angular CLI |
| Linting | ESLint with angular-eslint |
| Hosting | GitHub Pages, deployed by `.github/workflows/deploy.yml` |

## Getting started

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm start
```

Open http://localhost:4200.

## Scripts

| Command | What it does |
|---|---|
| `npm start` | Starts the dev server |
| `npm run build` | Builds into `dist/portfolio/browser` |
| `npm test` | Runs the unit tests once |
| `npm run lint` | Lints TypeScript and templates |

## Updating the content

All text lives in `src/app/data/`:

- `profile.ts`: name, title, summary, links, the About text
- `experience.ts`: jobs, newest first
- `projects.ts`: projects; `repo` is the repository name on GitHub, `liveUrl` is optional
- `skills.ts` and `education.ts`

Replace `public/cv/Mirza-Suljic-CV.pdf` to update the CV, and `public/images/mirza-suljic.webp` for the photo. `public/og-image.png` is the preview LinkedIn and other sites show when the link is shared.

## Project structure

```
src/
├── index.html                 Title, description and link-preview tags
├── styles.css                 Tailwind and theme
└── app/
    ├── app.ts / app.html      Page layout
    ├── layout/                Header (with mobile menu) and footer
    ├── sections/              hero, about, experience, projects, skills, contact
    ├── shared/                Icons, section heading, button styles
    ├── models/                Profile, Job, Project, SkillGroup, Education, Certification, Fact
    ├── data/                  The content
    └── utils/                 Date helpers, with tests
public/                        Photo, CV, favicon, link-preview image, robots.txt, sitemap.xml
```

## Deployment

The repository is named `MirzaSuljic.github.io`, so GitHub Pages serves it at the root of https://mirzasuljic.github.io. In the repository settings, **Pages → Source** is set to **GitHub Actions**. Every push to `main` builds the site and publishes it.
