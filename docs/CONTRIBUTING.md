# Contributing Guide

## Commit Message Guidelines

This project uses [Conventional Commits](https://www.conventionalcommits.org/) to ensure consistent and meaningful commit messages. We provide two ways to create properly formatted commits:

### Option 1: Interactive Commit with Commitizen (Recommended)

Use the interactive commit prompt for guided commit message creation:

```bash
# Stage your changes
git add .

# Use the interactive commit prompt
bun run commit
```

This will guide you through:
- **Type**: The type of change (feat, fix, docs, etc.)
- **Scope**: The area of the codebase affected (ui, api, auth, etc.)
- **Description**: A short description of the change
- **Body**: A longer description (optional)
- **Breaking Changes**: Any breaking changes (optional)
- **Issues**: Related issue numbers (optional)

### Option 2: Manual Commit with Commitlint Prompt

Use the commitlint prompt for a simpler guided experience:

```bash
# Stage your changes
git add .

# Use the commitlint prompt
bun run commit:prompt
```

### Commit Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

### Scopes

Common scopes in this project:
- **ui**: UI components and styling
- **components**: React components
- **storybook**: Storybook stories and configuration
- **auth**: Authentication related changes
- **api**: API routes and external API integrations
- **database**: Database schema and queries
- **config**: Configuration files
- **deps**: Dependency updates
- **ci**: CI/CD pipeline changes
- **docs**: Documentation updates
- **tests**: Test files and testing utilities
- **types**: TypeScript type definitions
- **utils**: Utility functions
- **hooks**: React hooks
- **styles**: CSS and styling changes
- **build**: Build configuration
- **deploy**: Deployment related changes

### Examples

```bash
feat(ui): add new button component with variants
fix(auth): resolve login redirect issue
docs(storybook): add component documentation
chore(deps): update dependencies to latest versions
```

## Pre-commit Hooks

This project uses [Lefthook](https://github.com/evilmartians/lefthook) with [lint-staged](https://github.com/okonet/lint-staged) to ensure code quality:

### What happens on commit:
1. **Lint-staged**: Runs linters only on staged files
   - Biome check and format for TypeScript/JavaScript
   - Biome format for JSON, Markdown, and CSS
   - Dependency check for package.json changes
2. **Type checking**: Runs TypeScript compiler on staged TS/TSX files
3. **Commit message validation**: Ensures commit messages follow conventional format

### Manual linting:
```bash
# Run lint-staged manually
bun run lint:staged

# Run full project linting
bun run lint

# Format all files
bun run format

# Type check
bun run typecheck
```

## Development Workflow

1. Create a feature branch: `git checkout -b feat/your-feature`
2. Make your changes
3. Stage your changes: `git add .`
4. Commit using the guided prompt: `bun run commit`
5. Push your branch: `git push origin feat/your-feature`
6. Create a pull request

The pre-commit hooks will automatically:
- Format and lint your staged files
- Check TypeScript types
- Validate your commit message format

This ensures consistent code quality and commit history across the project.