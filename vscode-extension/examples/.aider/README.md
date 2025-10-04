# .aider Directory

This directory stores project-level context and configuration for the Aider VS Code extension.

## Files

### project-context.json

Stores your project's rules, design principles, goals, and coding patterns.

**Should I commit this file?**
- **Yes, if**: You want to share project context with your team
- **No, if**: You have personal preferences or experimental settings

**Example Structure:**
```json
{
  "rules": [
    "Use TypeScript for all components",
    "No inline styles - use Tailwind CSS",
    "Follow SOLID principles"
  ],
  "designPrinciples": [
    "Mobile-first responsive design",
    "WCAG 2.1 AA accessibility compliance",
    "Minimalist UI with focus on content"
  ],
  "goals": [
    "Build MVP by Q2 2024",
    "Support offline mode",
    "Optimize for Core Web Vitals"
  ],
  "codingPatterns": {
    "API Calls": "Use custom hooks (useApi) for all API calls",
    "Error Handling": "Use ErrorBoundary component for React errors",
    "State Management": "Use Zustand for global state"
  },
  "framework": "Next.js 14",
  "lastUpdated": "2024-01-15T10:30:00.000Z"
}
```

## .gitignore Recommendations

Add to your `.gitignore` if you want to keep context local:
```
.aider/project-context.json
```

Or keep the directory but allow team sharing:
```
# Don't ignore .aider directory - we share project context
!.aider/
!.aider/project-context.json
```

## Usage

The Aider extension automatically:
1. Creates this directory on first use
2. Saves context changes
3. Loads context on startup
4. Applies context to all AI code generation

You can also manually edit `project-context.json` if needed.
