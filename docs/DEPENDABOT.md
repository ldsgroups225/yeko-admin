# Dependabot Automated Dependency Management

This document explains how Dependabot is configured for automated dependency management in the project.

## Overview

Dependabot automatically monitors dependencies and creates pull requests for updates, including security patches. The configuration includes intelligent grouping, auto-merge capabilities for safe updates, and comprehensive monitoring.

## Configuration

### Dependabot Configuration (`.github/dependabot.yml`)

The configuration includes:

#### NPM Dependencies
- **Schedule**: Weekly updates on Mondays at 9:00 UTC
- **Grouping Strategy**: Intelligent grouping by ecosystem and update type
- **Security Updates**: Immediate PRs for vulnerabilities
- **Version Constraints**: Major version updates blocked for critical dependencies

#### GitHub Actions
- **Schedule**: Weekly updates on Tuesdays at 10:00 UTC
- **Grouping**: All GitHub Actions updates grouped together
- **Auto-updates**: All update types allowed

### Update Groups

#### Patch Updates Group
All patch updates are grouped together for easier review:
```yaml
patch-updates:
  patterns: ["*"]
  update-types: ["patch"]
```

#### Ecosystem-Specific Groups
- **React Ecosystem**: React, Next.js, and related packages
- **UI Libraries**: Radix UI, Tailwind CSS, Lucide React
- **Testing Tools**: Playwright, Storybook, Vitest
- **Development Tools**: Biome, TypeScript, linting tools
- **Monitoring**: Sentry, LogTape, Checkly

### Ignored Dependencies

Critical dependencies with major version updates blocked:
- `react` and `react-dom`
- `next`
- `typescript`

## Auto-Merge System

### Auto-Merge Workflow (`.github/workflows/dependabot-auto-merge.yml`)

The auto-merge system automatically merges safe dependency updates:

#### Eligibility Criteria

**Always Safe for Auto-Merge:**
- Security updates (any severity)
- GitHub Actions patch/minor updates
- Type definition updates (`@types/*`)

**Safe for Patch Updates:**
- UI libraries (`@radix-ui/*`, `lucide-react`, `clsx`)
- Testing tools (`@storybook/*`, `@playwright/*`, `@vitest/*`)
- Development tools (`@biomejs/*`, `@commitlint/*`)
- Build tools (`tailwind*`, `lint-staged`, `lefthook`)

**Safe for Minor Updates:**
- Type definitions
- Testing and development tools
- Non-critical build tools

**Never Auto-Merged:**
- Critical dependencies (`react`, `next`, `@supabase/*`, `@sentry/*`)
- Major version updates of any dependency
- Unknown or unrecognized dependencies

#### Auto-Merge Process

1. **Validation**: Check if PR is from Dependabot and eligible
2. **CI Wait**: Wait for all status checks to pass (max 30 minutes)
3. **Auto-Merge**: Enable auto-merge with squash strategy
4. **Notification**: Add explanatory comment to PR

#### Manual Review Process

For non-eligible updates:
- Add "needs-review" and "manual-merge-required" labels
- Post comment explaining why manual review is needed
- Provide review checklist for maintainers

## Usage

### Monitoring Commands

```bash
# Check Dependabot configuration
bun run deps:check

# Analyze project dependencies
bun run deps:analyze

# Check for outdated dependencies
bun run deps:outdated

# Check for security vulnerabilities
bun run deps:security

# Generate comprehensive report
bun run deps:report

# Validate auto-merge rules
bun run deps:validate
```

### GitHub CLI Commands

```bash
# List Dependabot PRs
gh pr list --author "dependabot[bot]"

# View specific PR
gh pr view <pr-number>

# Manually enable auto-merge
gh pr merge <pr-number> --auto --squash

# Check PR status
gh pr status
```

## Security Updates

### Immediate Response
- Security updates create PRs immediately when vulnerabilities are detected
- These PRs are prioritized for auto-merge (if tests pass)
- Critical security updates bypass normal scheduling

### Vulnerability Handling
1. **Detection**: Dependabot scans for known vulnerabilities
2. **PR Creation**: Immediate PR with security label
3. **Auto-Merge**: Eligible for auto-merge if tests pass
4. **Notification**: Security updates are clearly marked

## Maintenance

### Weekly Tasks
- Review any failed auto-merge attempts
- Check for PRs requiring manual review
- Monitor dependency update patterns

### Monthly Tasks
- Review auto-merge rules and update if needed
- Analyze dependency trends and usage
- Update ignored dependencies list if necessary

### Quarterly Tasks
- Review and optimize grouping strategies
- Update security policies
- Audit auto-merge safety rules

## Troubleshooting

### Common Issues

#### Auto-Merge Not Working
```bash
# Check workflow status
gh run list --workflow=dependabot-auto-merge.yml

# View specific workflow run
gh run view <run-id>

# Check PR eligibility
bun run deps:validate
```

#### Too Many PRs
- Adjust grouping in `.github/dependabot.yml`
- Reduce `open-pull-requests-limit`
- Consider ignoring specific dependencies

#### Security Updates Delayed
- Check if security scanning is enabled
- Verify Dependabot has proper permissions
- Review ignored dependencies list

#### Failed CI Checks
- Review test failures in auto-merge workflow
- Check if new dependencies break existing functionality
- Consider updating test configurations

### Debug Steps

1. **Check Configuration**:
   ```bash
   bun run deps:check
   ```

2. **Validate Workflow**:
   ```bash
   bun run deps:validate
   ```

3. **Review Recent Activity**:
   ```bash
   gh pr list --author "dependabot[bot]" --state all
   ```

4. **Check Workflow Logs**:
   ```bash
   gh run list --workflow=dependabot-auto-merge.yml
   gh run view <run-id> --log
   ```

## Configuration Customization

### Adding New Safe Dependencies

Edit `.github/workflows/dependabot-auto-merge.yml`:

```bash
SAFE_PATCH_DEPENDENCIES=(
  # Add new safe dependencies here
  "your-new-dependency"
)
```

### Modifying Update Schedule

Edit `.github/dependabot.yml`:

```yaml
schedule:
  interval: "daily"  # or "weekly", "monthly"
  day: "monday"      # for weekly
  time: "09:00"
  timezone: "UTC"
```

### Adjusting Grouping Strategy

```yaml
groups:
  your-custom-group:
    patterns:
      - "pattern-*"
    update-types:
      - "patch"
      - "minor"
```

### Adding New Ecosystems

```yaml
- package-ecosystem: "docker"
  directory: "/"
  schedule:
    interval: "weekly"
```

## Best Practices

### Security
- Always prioritize security updates
- Review major version updates manually
- Keep critical dependencies under strict control
- Monitor for supply chain attacks

### Performance
- Group related updates to reduce PR noise
- Use appropriate update schedules
- Limit concurrent PRs to manageable numbers
- Optimize CI/CD pipeline for dependency updates

### Maintenance
- Regularly review and update auto-merge rules
- Monitor dependency health and usage
- Keep documentation up to date
- Train team members on Dependabot workflows

### Quality Assurance
- Ensure comprehensive test coverage
- Use staging environments for validation
- Implement proper rollback procedures
- Monitor application performance after updates

## Integration with Development Workflow

### Pull Request Process
1. Dependabot creates PR with grouped updates
2. Auto-merge workflow evaluates eligibility
3. CI/CD pipeline runs all tests
4. Auto-merge occurs if all checks pass
5. Manual review required for complex updates

### Release Process
- Dependency updates are included in regular releases
- Security updates may trigger immediate releases
- Version bumps follow semantic versioning
- Changelog includes dependency updates

### Monitoring and Alerting
- Failed auto-merges trigger notifications
- Security updates are highlighted
- Dependency health is tracked over time
- Performance impacts are monitored

## Metrics and Reporting

### Key Metrics
- Number of dependency updates per month
- Auto-merge success rate
- Time to merge security updates
- Failed update reasons

### Reporting
- Weekly dependency update summaries
- Monthly security update reports
- Quarterly dependency health assessments
- Annual dependency strategy reviews

### Tools
- GitHub Insights for PR analytics
- Dependabot security advisories
- Custom reporting scripts
- Third-party dependency monitoring tools

## Future Enhancements

### Planned Features
- Advanced dependency risk assessment
- Automated rollback for failed updates
- Integration with vulnerability databases
- Custom notification channels

### Experimental Features
- AI-powered update prioritization
- Predictive dependency conflict detection
- Automated compatibility testing
- Smart scheduling based on project activity

## Resources

- [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)
- [Dependabot Configuration Reference](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file)
- [GitHub Security Advisories](https://docs.github.com/en/code-security/security-advisories)
- [Dependency Management Best Practices](https://docs.github.com/en/code-security/supply-chain-security)