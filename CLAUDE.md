# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Angular 20.0.0 project called "FacialRecognition" that uses standalone components and the Angular CLI.

## Commands

### Development Server

```bash
ng serve
```
This starts the development server at http://localhost:4200/. The application auto-reloads on file changes.

### Building

```bash
ng build
```
Builds the project to the `dist/` directory.

### Running Tests

```bash
ng test
```
Executes unit tests via Karma.

```bash
ng e2e
```
Runs end-to-end tests (requires installation of an e2e testing framework).

### Code Scaffolding

```bash
ng generate component component-name
```
Generates a new component.

```bash
ng generate directive|pipe|service|class|guard|interface|enum|module
```
Generates other Angular artifacts.

### Development Workflow

```bash
# Start development with auto-rebuild
npm run watch
```

## Architecture

This Angular project follows the standalone component architecture (new in Angular 14+):

1. **Entry Point**: `src/main.ts` bootstraps the application using `bootstrapApplication` with the root `App` component.

2. **Application Configuration**: `src/app/app.config.ts` defines providers for the application including routing.

3. **Routing**: `src/app/app.routes.ts` contains route definitions.

4. **Components**: Uses standalone components with dependencies imported directly into each component.

Key architectural points:
- No NgModules - uses the modern standalone component API
- Angular 20 features such as provideRouter, provideBrowserGlobalErrorListeners
- Zone.js for change detection

## TypeScript Configuration

The project uses strict TypeScript settings:
- Strict mode enabled
- No implicit returns/overrides
- ES2022 target