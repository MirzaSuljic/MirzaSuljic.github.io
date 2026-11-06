import type { Project } from '../models';

export const PROJECTS: Project[] = [
  {
    name: 'Watchlist',
    repo: 'angularMovieDB',
    summary:
      'Movies and TV shows from TMDB: browse lists, search, open details with cast and key facts, and follow a monthly premiere calendar.',
    tech: ['Angular 21', 'Signals', 'RxJS', 'Tailwind CSS'],
    liveUrl: null,
  },
  {
    name: 'Products CRUD',
    repo: 'react-spring-crud',
    summary: 'A full stack CRUD app: a React front end talking to a Spring Boot REST API, with data in PostgreSQL on Neon.',
    tech: ['React', 'Spring Boot', 'Java', 'PostgreSQL'],
    liveUrl: null,
  },
  {
    name: 'Watchlist',
    repo: 'react-movie-db',
    summary:
      'Keep track of the movies and TV shows you want to see, with details pages, a release calendar and lists saved in the browser.',
    tech: ['React 19', 'TypeScript', 'React Router 7', 'Tailwind CSS'],
    liveUrl: null,
  },
  {
    name: 'Clothing Store',
    repo: 'react-clothing-store',
    summary:
      'A demo fashion store with collections, a size picker, a cart drawer and a three-step checkout with field validation.',
    tech: ['React 19', 'TypeScript', 'React Router 7', 'Tailwind CSS'],
    liveUrl: 'https://rc-clothing-store.netlify.app/',
  },
  {
    name: 'Project Manager',
    repo: 'project-manager-app',
    summary: 'Project and task management with a Next.js front end. The backend is being rebuilt in Java and Spring Boot.',
    tech: ['Next.js', 'SQL', 'Spring Boot'],
    liveUrl: null,
    inProgress: true,
  },
  {
    name: 'RoboFriends',
    repo: 'robofriends',
    summary: 'Search a crowd of robot friends as you type. A small app for practising Redux Toolkit and typed hooks.',
    tech: ['React 19', 'Redux Toolkit', 'TypeScript'],
    liveUrl: 'https://mirzasuljic.github.io/robofriends/',
  },
];
