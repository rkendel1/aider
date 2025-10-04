# Project Context Management

Store and manage project-specific rules, design principles, goals, and coding patterns to ensure Aider follows your team's standards.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Context File Structure](#context-file-structure)
- [Managing Context](#managing-context)
- [Usage](#usage)
- [Best Practices](#best-practices)
- [Examples](#examples)

## Overview

Project Context allows you to define project-level standards that Aider uses when generating code:

- **Rules**: Coding standards and constraints
- **Design Principles**: UI/UX guidelines
- **Goals**: Project objectives and milestones
- **Coding Patterns**: Reusable code templates
- **Framework Info**: Tech stack details

### Benefits

✅ **Consistency**: All generated code follows your standards  
✅ **Team Alignment**: Shared context across team members  
✅ **Quality Control**: Automatic validation against rules  
✅ **Onboarding**: New developers understand project conventions  
✅ **Version Control**: Context stored in `.aider/project-context.json`  

## Quick Start

### 1. Create Project Context

**Method A: Via Command**
1. Open Command Palette (Ctrl+Shift+P)
2. Type "Aider: Edit Project Context"
3. JSON file opens in editor

**Method B: Create Manually**
```bash
mkdir -p .aider
touch .aider/project-context.json
```

### 2. Define Your Context

```json
{
  "rules": [
    "Use TypeScript for all components",
    "No inline styles - use Tailwind CSS",
    "Follow SOLID principles"
  ],
  "designPrinciples": [
    "Mobile-first responsive design",
    "WCAG 2.1 AA accessibility",
    "Minimalist UI"
  ],
  "goals": [
    "Build MVP by Q2 2024",
    "Support offline mode"
  ],
  "codingPatterns": {
    "API Calls": "Use custom hooks (useApi)",
    "Error Handling": "Use ErrorBoundary component",
    "State Management": "Use Zustand for global state"
  },
  "framework": "Next.js 14"
}
```

### 3. Use in Aider

Now when you ask Aider to generate code:

```
Chat: "Create a user profile component"

Aider will:
✓ Use TypeScript
✓ Style with Tailwind CSS
✓ Follow SOLID principles
✓ Ensure mobile-first responsive design
✓ Include accessibility features
✓ Use Zustand if state needed
```

## Context File Structure

### Location

```
.aider/
└── project-context.json
```

Should you commit this file?
- **Yes, if**: Sharing context with team
- **No, if**: Personal preferences or experimental

### Schema

```json
{
  "rules": [string],              // Coding standards
  "designPrinciples": [string],   // UI/UX guidelines
  "goals": [string],              // Project objectives
  "codingPatterns": {             // Reusable patterns
    "category": "pattern"
  },
  "framework": string,            // Main framework
  "techStack": [string],          // Technologies used
  "lastUpdated": string           // ISO date (auto-updated)
}
```

### Example Complete Context

```json
{
  "rules": [
    "Use TypeScript for all components",
    "No inline styles - use Tailwind CSS",
    "Follow SOLID principles",
    "Maximum function length: 50 lines",
    "Use named exports, not default",
    "Add JSDoc comments to public functions",
    "Handle errors with try-catch, never fail silently"
  ],
  "designPrinciples": [
    "Mobile-first responsive design",
    "WCAG 2.1 AA accessibility compliance",
    "Minimalist UI with focus on content",
    "Maximum 3-click navigation depth",
    "Loading states for all async operations",
    "Error messages must be user-friendly"
  ],
  "goals": [
    "Build MVP by Q2 2024",
    "Support offline mode",
    "Optimize for Core Web Vitals",
    "Achieve 90+ Lighthouse score"
  ],
  "codingPatterns": {
    "API Calls": "Use custom hooks (useApi) for all API calls",
    "Error Handling": "Use ErrorBoundary component for React errors",
    "State Management": "Use Zustand for global state",
    "Forms": "Use React Hook Form with Zod validation",
    "Styling": "Use Tailwind utilities, cn() for conditional classes",
    "Components": "Co-locate styles and tests with components",
    "Testing": "Jest + React Testing Library, aim for 80% coverage"
  },
  "framework": "Next.js 14",
  "techStack": [
    "Next.js 14",
    "React 18",
    "TypeScript",
    "Tailwind CSS",
    "Zustand",
    "React Hook Form",
    "Zod",
    "Supabase"
  ],
  "lastUpdated": "2024-01-15T10:30:00.000Z"
}
```

## Managing Context

### View Current Context

**Command Palette:**
```
Aider: Show Project Context
```

**Or check file:**
```bash
cat .aider/project-context.json
```

### Edit Context

**Via VS Code:**
1. Open Command Palette
2. "Aider: Edit Project Context"
3. Make changes
4. Save file (Ctrl+S)

**Via Chat:**
```
Chat: "Add a rule: All API endpoints must use async/await"

Aider updates .aider/project-context.json
```

### Validate Context

Aider automatically validates generated code against rules:

```
Chat: "Create a component with inline styles"

Aider responds:
⚠️  Warning: This may violate project rule:
"No inline styles - use Tailwind CSS"

Would you like me to use Tailwind instead?
```

### Reset Context

**Remove all context:**
```bash
rm .aider/project-context.json
```

**Or edit and clear:**
```json
{
  "rules": [],
  "designPrinciples": [],
  "goals": [],
  "codingPatterns": {}
}
```

## Usage

### During Code Generation

Context is automatically applied when:
- Creating new components
- Refactoring existing code
- Generating boilerplate
- Analyzing screenshots
- Answering architecture questions

### Validation

Aider validates code against rules:

**Example 1: Rule Violation**
```
Rule: "Use TypeScript for all components"
Generated: JavaScript component

Result: Warning shown, offers to convert to TypeScript
```

**Example 2: Pattern Enforcement**
```
Pattern: "API Calls": "Use custom hooks (useApi)"
Generated: fetch() directly in component

Result: Suggests using useApi hook instead
```

### Context-Aware Suggestions

Aider provides suggestions based on context:

```
Chat: "How should I handle form validation?"

Aider: Based on your project context:
- Use React Hook Form (from codingPatterns)
- Add Zod validation (from codingPatterns)
- Ensure WCAG compliance (from designPrinciples)
```

## Best Practices

### Rules

**✓ Good Rules:**
- Specific and actionable
- Technology/framework agnostic where possible
- Enforceable by linters or code review

```json
"rules": [
  "Use TypeScript for all components",
  "Maximum function length: 50 lines",
  "Add JSDoc to public functions"
]
```

**✗ Avoid:**
- Vague or subjective rules
- Conflicting rules
- Too many rules (focus on most important)

```json
"rules": [
  "Write good code",  // Too vague
  "Be creative"       // Too subjective
]
```

### Design Principles

**✓ Good Principles:**
- User-focused
- Measurable
- Guide design decisions

```json
"designPrinciples": [
  "Mobile-first responsive design",
  "WCAG 2.1 AA accessibility",
  "Maximum 3-click navigation"
]
```

### Coding Patterns

**✓ Good Patterns:**
- Include examples
- Show structure
- Reference tools/libraries

```json
"codingPatterns": {
  "API Calls": "Use useApi hook: const { data, loading, error } = useApi('/endpoint')",
  "Forms": "React Hook Form + Zod: useForm({ resolver: zodResolver(schema) })"
}
```

### Keeping Context Updated

- Review context monthly
- Update when adopting new patterns
- Remove outdated rules
- Increment lastUpdated date
- Communicate changes to team

## Examples

### Startup SaaS Project

```json
{
  "rules": [
    "Use TypeScript everywhere",
    "Tailwind for all styling",
    "Mobile-first design"
  ],
  "designPrinciples": [
    "Fast load times (<2s)",
    "Simple, clean UI",
    "Accessible to all users"
  ],
  "goals": [
    "Launch MVP in 3 months",
    "Support 1000 users",
    "99.9% uptime"
  ],
  "codingPatterns": {
    "Auth": "Use Supabase Auth",
    "Database": "Supabase PostgreSQL",
    "Payments": "Stripe Checkout",
    "Email": "Resend for transactional emails"
  },
  "framework": "Next.js 14",
  "techStack": ["Next.js", "TypeScript", "Tailwind", "Supabase", "Stripe"]
}
```

### Enterprise Dashboard

```json
{
  "rules": [
    "TypeScript strict mode",
    "Comprehensive unit tests (80% coverage)",
    "No external API calls without approval",
    "All data must be validated server-side"
  ],
  "designPrinciples": [
    "Enterprise-grade security",
    "Role-based access control",
    "Audit logs for all actions",
    "WCAG AAA compliance"
  ],
  "goals": [
    "SOC 2 compliance",
    "Support 10k concurrent users",
    "Sub-second page loads"
  ],
  "codingPatterns": {
    "API": "tRPC with Zod validation",
    "State": "Redux Toolkit",
    "Testing": "Vitest + Testing Library",
    "Security": "OWASP Top 10 compliance"
  },
  "framework": "Next.js 14",
  "techStack": ["Next.js", "TypeScript", "Redux", "tRPC", "PostgreSQL"]
}
```

### Mobile App

```json
{
  "rules": [
    "React Native with TypeScript",
    "Offline-first architecture",
    "Native modules only when necessary"
  ],
  "designPrinciples": [
    "Native look and feel",
    "Works offline",
    "Minimal battery usage",
    "Accessible to screen readers"
  ],
  "goals": [
    "App Store launch Q3",
    "4.5+ star rating",
    "Support iOS 14+ and Android 10+"
  ],
  "codingPatterns": {
    "Storage": "AsyncStorage for simple data, SQLite for complex",
    "Navigation": "React Navigation v6",
    "API": "React Query with offline persistence",
    "Push": "Firebase Cloud Messaging"
  },
  "framework": "React Native",
  "techStack": ["React Native", "TypeScript", "React Query", "SQLite"]
}
```

## Related Documentation

- **[Vision Models](vision-models.md)** - Screenshots respect project context
- **[AI Providers](ai-providers.md)** - All providers use context
- **[Getting Started](../usage/getting-started.md)** - Set up context early

---

**Pro Tip:** Define project context early, and update it as your project evolves! 📋

*Questions? Check the [examples](#examples) or [open an issue](https://github.com/Aider-AI/aider/issues).*
