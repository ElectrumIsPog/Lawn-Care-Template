# Lawn Care Pro Template - Development Guide

## Authentication System

This project uses Supabase for authentication and database storage. The authentication system consists of several key components:

### 1. Authentication Components

- **Client-side Authentication**: Located in `src/lib/auth.ts`
  - `signIn()`: Logs in users with email and password
  - `signOut()`: Logs out users and redirects to login page
  - `getSession()`: Retrieves the current session
  - `getUser()`: Gets user information
  - `isAuthenticated()`: Checks authentication status
  - `isAdmin()`: Simplified to check if user is authenticated

- **API Route Protection**: Located in `src/lib/apiAuth.ts`
  - `checkApiAuth()`: Middleware to verify authentication for API routes
  - Handles cookies and authorization headers for authentication

- **Client Route Protection**: Located in `src/components/auth/RequireAuth.tsx`
  - React component that wraps protected pages
  - Redirects to login if user is not authenticated
  - Shows loading state while checking authentication

### 2. Database Security

- **Row Level Security (RLS)**: Defined in `supabase/schema.sql`
  - Tables have specific policies for different operations
  - Public read access for most tables
  - Write operations restricted to authenticated users

## Development Mode

For easier local development, the application includes a development mode that bypasses authentication checks:

### Enabling Development Mode

Development mode is controlled by an environment variable in `.env.local`:

```
NEXT_PUBLIC_SKIP_AUTH_FOR_LOCALHOST=true
```

When this variable is set to `true` and the application is running on localhost:
1. API authentication checks will be bypassed
2. You won't need to have a valid Supabase session to access protected routes

### Hydration Issues

The application handles potential React hydration mismatches by:
1. Using client-side state to determine when to render environment-specific content
2. Ensuring server and client render the same initial content

## Troubleshooting

- **Authentication Issues**: Check browser console for auth-related errors
- **Hydration Warnings**: Look for inconsistencies between server-rendered and client-rendered content
- **API Access Denied**: Ensure dev mode is enabled or that you're properly authenticated

## Best Practices

1. Always wrap admin pages with the `RequireAuth` component
2. Use the `checkApiAuth` middleware in API routes that require authentication
3. Test both with and without development mode to ensure proper authentication

## Database Schema

The database includes the following tables:
- `services`: Lawn care services offered
- `gallery_images`: Project portfolio images
- `site_settings`: General website configuration
- `contact_submissions`: Form submissions from visitors

Each table has its own set of RLS policies to control access. 