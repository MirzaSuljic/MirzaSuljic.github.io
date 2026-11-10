/**
 * Recognises what a project is built with from its build files
 * (package.json, pom.xml, build.gradle / build.gradle.kts).
 */

type Rule = [dependency: string | RegExp, label: string, withVersion?: boolean];

// order = order of the chips: frameworks first, then libraries and tools
const NPM_RULES: Rule[] = [
  ['@angular/core', 'Angular', true],
  ['next', 'Next.js', true],
  ['react', 'React', true],
  ['vue', 'Vue', true],
  ['svelte', 'Svelte', true],
  ['react-native', 'React Native'],
  ['express', 'Express'],
  ['@nestjs/core', 'NestJS'],
  ['typescript', 'TypeScript'],
  ['@reduxjs/toolkit', 'Redux Toolkit'],
  ['react-router', 'React Router', true],
  ['react-router-dom', 'React Router', true],
  ['@ngrx/store', 'NgRx'],
  ['tailwindcss', 'Tailwind CSS'],
  ['bootstrap', 'Bootstrap'],
  ['@angular/material', 'Angular Material'],
  ['@mui/material', 'MUI'],
  ['vite', 'Vite'],
  ['prisma', 'Prisma'],
  ['@prisma/client', 'Prisma'],
];

const POM_RULES: Rule[] = [
  ['spring-boot-starter-security', 'Spring Security'],
  ['postgresql', 'PostgreSQL'],
  ['mysql-connector', 'MySQL'],
  ['mongodb', 'MongoDB'],
  [/java-jwt|jjwt/, 'JWT'],
];

/** "^22.2.4" -> "22" */
function major(version: string | undefined): string | null {
  const match = version?.match(/(\d+)/);
  return match ? match[1] : null;
}

export function techFromPackageJson(text: string): string[] {
  let pkg: { dependencies?: Record<string, string>; devDependencies?: Record<string, string> };
  try {
    pkg = JSON.parse(text);
  } catch {
    return [];
  }
  const deps = { ...pkg.devDependencies, ...pkg.dependencies };
  const found: string[] = [];
  for (const [dep, label, withVersion] of NPM_RULES) {
    const version = typeof dep === 'string' ? deps[dep] : undefined;
    if (version === undefined) continue;
    // Next.js and React Native already imply React
    if (label === 'React' && (deps['next'] || deps['react-native'])) continue;
    const v = withVersion ? major(version) : null;
    found.push(v ? `${label} ${v}` : label);
  }
  return found;
}

export function techFromPom(text: string): string[] {
  const found: string[] = [];
  const boot = text.match(/<artifactId>spring-boot-starter-parent<\/artifactId>\s*<version>([^<]+)<\/version>/);
  if (boot || text.includes('spring-boot')) {
    const v = major(boot?.[1]);
    found.push(v ? `Spring Boot ${v}` : 'Spring Boot');
  }
  const java = text.match(/<java\.version>([^<]+)<\/java\.version>/);
  found.push(java ? `Java ${major(java[1]) ?? java[1]}` : 'Java');
  for (const [dep, label] of POM_RULES) {
    if (typeof dep === 'string' ? text.includes(dep) : dep.test(text)) found.push(label);
  }
  return found;
}

export function techFromGradle(text: string): string[] {
  const found: string[] = [];
  if (/com\.android\.(application|library)|android\s*\{/.test(text)) found.push('Android');
  if (/kotlin/i.test(text)) found.push('Kotlin');
  if (/compose/i.test(text)) found.push('Jetpack Compose');
  if (/org\.springframework\.boot/.test(text)) found.push('Spring Boot');
  if (/room-runtime|androidx\.room/.test(text)) found.push('Room');
  if (/retrofit/.test(text)) found.push('Retrofit');
  return found;
}

/** Which build file reader fits a path ("03-frontend/app/package.json" -> package.json reader). */
export function techFromFile(path: string, text: string): string[] {
  if (path.endsWith('package.json')) return techFromPackageJson(text);
  if (path.endsWith('pom.xml')) return techFromPom(text);
  if (/build\.gradle(\.kts)?$/.test(path)) return techFromGradle(text);
  return [];
}

/** Build files worth reading in a repository tree (no node_modules, not too deep, at most 6). */
export function buildFilePaths(paths: string[]): string[] {
  return paths
    .filter((p) => /(^|\/)(package\.json|pom\.xml|build\.gradle(\.kts)?)$/.test(p))
    .filter((p) => !p.includes('node_modules/') && p.split('/').length <= 4)
    .sort((a, b) => a.split('/').length - b.split('/').length)
    .slice(0, 6);
}

const key = (label: string) => label.toLowerCase().split(' ')[0];

/**
 * Detected tech first (without duplicates), then hand-written extras that were not detected
 * ("Angular 21" is replaced by a detected "Angular 22", "Signals" stays). At most 7 chips.
 */
export function mergeTech(detected: string[], handWritten: string[] = []): string[] {
  const result: string[] = [];
  for (const label of [...detected, ...handWritten]) {
    if (!result.some((r) => key(r) === key(label))) result.push(label);
  }
  return result.slice(0, 7);
}
