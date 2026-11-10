import { buildFilePaths, mergeTech, techFromGradle, techFromPackageJson, techFromPom } from './detect-tech';

describe('detect-tech', () => {
  it('reads frameworks and versions from package.json', () => {
    const pkg = JSON.stringify({
      dependencies: { '@angular/core': '^22.2.4', rxjs: '~7.8.0' },
      devDependencies: { tailwindcss: '^4.1.0', typescript: '~6.0.3' },
    });
    expect(techFromPackageJson(pkg)).toEqual(['Angular 22', 'TypeScript', 'Tailwind CSS']);

    const react = JSON.stringify({ dependencies: { react: '^19.1.0', 'react-router': '^7.0.0' }, devDependencies: { vite: '^7.0.0' } });
    expect(techFromPackageJson(react)).toEqual(['React 19', 'React Router 7', 'Vite']);

    expect(techFromPackageJson(JSON.stringify({ dependencies: { next: '15.0.0', react: '19.0.0' } }))).toEqual(['Next.js 15']);
    expect(techFromPackageJson('not json')).toEqual([]);
  });

  it('reads Spring Boot, Java and the database from pom.xml', () => {
    const pom = `<parent><groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-parent</artifactId>
      <version>4.1.2</version></parent>
      <properties><java.version>21</java.version></properties>
      <artifactId>postgresql</artifactId><artifactId>java-jwt</artifactId>`;
    expect(techFromPom(pom)).toEqual(['Spring Boot 4', 'Java 21', 'PostgreSQL', 'JWT']);
  });

  it('reads Android and Kotlin from Gradle', () => {
    const gradle = `plugins { id("com.android.application"); id("org.jetbrains.kotlin.android") }
      buildFeatures { compose = true }`;
    expect(techFromGradle(gradle)).toEqual(['Android', 'Kotlin', 'Jetpack Compose']);
  });

  it('picks build files from a repository tree', () => {
    expect(
      buildFilePaths([
        'README.md',
        '03-frontend/angular-ecommerce/package.json',
        '02-backend/spring-boot-ecommerce/pom.xml',
        'frontend/node_modules/x/package.json',
      ])
    ).toEqual(['03-frontend/angular-ecommerce/package.json', '02-backend/spring-boot-ecommerce/pom.xml']);
  });

  it('merges detected and hand-written tech without duplicates', () => {
    expect(mergeTech(['Angular 22', 'TypeScript'], ['Angular 21', 'Signals'])).toEqual(['Angular 22', 'TypeScript', 'Signals']);
    expect(mergeTech([], ['React', 'Spring Boot'])).toEqual(['React', 'Spring Boot']);
  });
});
