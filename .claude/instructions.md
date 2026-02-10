# Claude Code Instructions for igra-landing

## Git Workflow

When creating pull requests:

1. **Always create a new feature branch from main**
   ```bash
   git fetch origin
   git checkout main
   git pull origin main
   git checkout -b feature/descriptive-branch-name
   ```

2. Make the requested changes

3. Commit with meaningful messages

4. Push and create PR against main branch

**Important:** Never work on existing feature branches. Always start fresh from main to avoid including unrelated commits.

## Branch Naming Convention

Use descriptive branch names with the `feature/` prefix:
- `feature/update-roadmap-and-security-description`
- `feature/add-new-component`
- `feature/fix-styling-issue`
