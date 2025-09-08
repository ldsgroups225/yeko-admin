# GitHub Actions CI/CD Documentation

This document explains the comprehensive GitHub Actions workflows implemented for the project.

## Overview

The project uses multiple GitHub Actions workflows to ensure code quality, security, and reliable deployments:

1. **CI/CD Pipeline** (`ci.yml`) - Main testing and quality assurance
2. **Chromatic Visual Testing** (`chromatic.yml`) - Visual regression testing
3. **Security Monitoring** (`security.yml`) - Security audits and dependency monitoring
4. **Release Management** (`release.yml`) - Automated releases and deployments

## Workflows

### 1. CI/CD Pipeline (`ci.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches
- Excludes draft PRs

**Jobs:**

#### Code Quality (`lint-and-format`)
- Runs Biome linting and formatting
- TypeScript type checking
- Dependency analysis with knip
- Package.json validation

#### Unit Tests (`test-unit`)
- Storybook component tests
- Code coverage reporting to Codecov
- Test result artifacts

#### Build Test (`build-test`)
- Next.js application build
- Storybook static build
- Build artifact upload for downstream jobs

#### Visual Tests (`test-visual`)
- Playwright visual regression tests
- Screenshot comparison
- Test result artifacts on failure

#### E2E Tests (`test-e2e`)
- End-to-end testing with Playwright
- Full user journey validation
- Test result artifacts on failure

#### Security Audit (`security-audit`)
- Dependency vulnerability scanning
- Security audit reporting
- Moderate/high severity vulnerability detection

#### Lighthouse Audit (`lighthouse`)
- Performance testing
- Accessibility validation
- SEO optimization checks
- Core Web Vitals monitoring

#### CodeRabbit Config Validation (`validate-coderabbit`)
- Configuration file validation
- YAML syntax checking
- Required field verification

#### Dependency Analysis (`dependency-analysis`)
- Bundle size analysis
- Unused dependency detection
- Dependency health monitoring

#### Results Notification (`notify-results`)
- Comprehensive status summary
- PR comment with results
- GitHub step summary generation

### 2. Chromatic Visual Testing (`chromatic.yml`)

**Triggers:**
- Push to `main` branch
- Pull requests (non-draft)
- Excludes dependabot PRs

**Features:**
- Storybook visual regression testing
- Automatic baseline updates on main
- PR comments with results
- Build artifact management

### 3. Security Monitoring (`security.yml`)

**Triggers:**
- Daily schedule (2 AM UTC)
- Push to main (package.json changes)
- Pull requests (dependency changes)
- Manual workflow dispatch

**Jobs:**

#### Security Audit
- Vulnerability scanning
- Audit report generation
- Automatic issue creation for vulnerabilities

#### License Compliance
- License compatibility checking
- Compliance reporting
- Legal risk assessment

#### Dependency Analysis
- Unused dependency detection
- Dependency health monitoring
- Analysis reporting

#### SAST Scan
- Static application security testing
- Security pattern analysis
- Code quality assessment

#### Security Summary
- Combined reporting
- Artifact aggregation
- Long-term report retention

### 4. Release Management (`release.yml`)

**Triggers:**
- Push to main branch
- Git tags (v*)
- Manual workflow dispatch with options

**Jobs:**

#### Prepare Release
- Version calculation (patch/minor/major)
- Package.json version updates
- Git tag creation
- Pre-release support

#### Build Release Assets
- Production build generation
- Asset packaging
- Build information documentation

#### Create GitHub Release
- Automatic changelog generation
- Release notes creation
- Asset attachment
- Draft/prerelease support

#### Deploy to Staging
- Staging environment deployment
- Deployment verification
- Environment-specific configuration

#### Release Notification
- Team notifications
- Release summary generation
- Next steps documentation

## Configuration

### Environment Variables

#### Required Secrets
```bash
# GitHub token for API access
GITHUB_TOKEN=<automatic>

# Codecov integration
CODECOV_TOKEN=<your_codecov_token>

# Chromatic visual testing
CHROMATIC_PROJECT_TOKEN=<your_chromatic_token>

# Lighthouse CI
LHCI_GITHUB_APP_TOKEN=<your_lighthouse_token>
```

#### Environment-Specific Variables
```bash
# Application URL
NEXT_PUBLIC_SITE_URL=<your_site_url>

# Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_supabase_key>

# Sentry (disabled in CI)
NEXT_PUBLIC_SENTRY_DISABLED=true
```

### Lighthouse CI Configuration

The `lighthouserc.js` file configures performance budgets:

```javascript
assertions: {
  'categories:performance': ['error', { minScore: 0.8 }],
  'categories:accessibility': ['error', { minScore: 0.9 }],
  'categories:best-practices': ['error', { minScore: 0.9 }],
  'categories:seo': ['error', { minScore: 0.9 }],
}
```

### CodeRabbit Configuration

The `.coderabbit.yaml` file configures AI code reviews:

```yaml
reviews:
  auto_review: true
  focus:
    - security
    - performance
    - accessibility
    - best_practices
```

## Workflow Optimization

### Performance Optimizations

1. **Concurrency Control**: Cancels in-progress runs on new pushes
2. **Conditional Execution**: Skips jobs for draft PRs and dependabot
3. **Artifact Sharing**: Reuses build artifacts across jobs
4. **Parallel Execution**: Runs independent jobs concurrently

### Resource Management

1. **Artifact Retention**: Different retention periods based on importance
2. **Cache Utilization**: Bun dependency caching
3. **Browser Installation**: Cached Playwright browsers
4. **Build Optimization**: Turbopack for faster builds

### Error Handling

1. **Graceful Failures**: Continue on non-critical failures
2. **Detailed Reporting**: Comprehensive error artifacts
3. **Automatic Retries**: Built-in GitHub Actions retry logic
4. **Fallback Strategies**: Alternative approaches for flaky tests

## Monitoring and Maintenance

### Workflow Health

Monitor workflow success rates and execution times:

```bash
# View workflow runs
gh run list --workflow=ci.yml

# Check specific run details
gh run view <run-id>

# Download artifacts
gh run download <run-id>
```

### Performance Metrics

Track key metrics:
- Build times
- Test execution duration
- Artifact sizes
- Success/failure rates

### Regular Maintenance

1. **Weekly**: Review failed workflows and flaky tests
2. **Monthly**: Update action versions and dependencies
3. **Quarterly**: Review and optimize workflow performance
4. **Annually**: Audit security configurations and permissions

## Troubleshooting

### Common Issues

#### Build Failures
```bash
# Check build logs
gh run view <run-id> --log

# Run build locally
bun run build

# Check for missing environment variables
```

#### Test Failures
```bash
# Download test artifacts
gh run download <run-id> --name playwright-report

# Run tests locally
bun run test:visual
bun run test:e2e
```

#### Security Audit Failures
```bash
# Check security report
gh run download <run-id> --name security-report

# Run audit locally
bun audit
```

#### Lighthouse Failures
```bash
# Check lighthouse results
gh run download <run-id> --name lighthouse-results

# Run lighthouse locally
bun run lighthouse
```

### Debug Strategies

1. **Enable Debug Logging**: Add `ACTIONS_STEP_DEBUG=true` secret
2. **SSH Access**: Use `tmate` action for interactive debugging
3. **Local Reproduction**: Run workflows locally with `act`
4. **Artifact Analysis**: Download and examine failure artifacts

## Security Considerations

### Secrets Management

1. **Principle of Least Privilege**: Minimal required permissions
2. **Secret Rotation**: Regular token updates
3. **Environment Isolation**: Separate secrets per environment
4. **Audit Logging**: Monitor secret usage

### Code Security

1. **Dependency Scanning**: Automated vulnerability detection
2. **SAST Analysis**: Static code security analysis
3. **License Compliance**: Legal risk assessment
4. **Supply Chain Security**: Verified action sources

### Access Control

1. **Branch Protection**: Required status checks
2. **Review Requirements**: Mandatory code reviews
3. **Environment Protection**: Staging/production gates
4. **Audit Trails**: Complete action history

## Integration with Development Workflow

### Pull Request Process

1. **Automatic Checks**: All workflows run on PR creation
2. **Status Checks**: Required for merge approval
3. **Visual Reviews**: Chromatic integration
4. **Performance Gates**: Lighthouse budgets

### Release Process

1. **Semantic Versioning**: Automated version management
2. **Changelog Generation**: Automatic release notes
3. **Asset Management**: Build artifact packaging
4. **Deployment Automation**: Staging environment updates

### Quality Gates

1. **Code Quality**: Linting and formatting requirements
2. **Test Coverage**: Minimum coverage thresholds
3. **Security Standards**: Vulnerability scanning
4. **Performance Budgets**: Lighthouse score requirements

## Best Practices

### Workflow Design

1. **Modular Jobs**: Single responsibility principle
2. **Conditional Execution**: Skip unnecessary work
3. **Artifact Management**: Efficient storage and sharing
4. **Error Handling**: Graceful failure recovery

### Configuration Management

1. **Environment Parity**: Consistent configurations
2. **Secret Security**: Proper secret handling
3. **Version Pinning**: Stable action versions
4. **Documentation**: Clear configuration docs

### Monitoring and Alerting

1. **Failure Notifications**: Immediate failure alerts
2. **Performance Monitoring**: Execution time tracking
3. **Success Metrics**: Quality trend analysis
4. **Regular Reviews**: Workflow health assessments

## Future Enhancements

### Planned Improvements

1. **Matrix Builds**: Multi-environment testing
2. **Deployment Strategies**: Blue-green deployments
3. **Advanced Monitoring**: Custom metrics collection
4. **Integration Testing**: Cross-service validation

### Experimental Features

1. **AI-Powered Reviews**: Enhanced CodeRabbit integration
2. **Predictive Analysis**: Failure prediction models
3. **Auto-Remediation**: Automatic fix suggestions
4. **Performance Optimization**: ML-driven optimizations

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Lighthouse CI Guide](https://github.com/GoogleChrome/lighthouse-ci)
- [CodeRabbit Configuration](https://docs.coderabbit.ai/)
- [Chromatic Documentation](https://www.chromatic.com/docs/)
- [Playwright CI Guide](https://playwright.dev/docs/ci)