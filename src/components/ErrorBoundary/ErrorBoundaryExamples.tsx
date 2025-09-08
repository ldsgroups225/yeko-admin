"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ApiErrorBoundary,
  AuthErrorBoundary,
  ComponentErrorBoundary,
  DatabaseErrorBoundary,
  FormErrorBoundary,
  PageErrorBoundary,
  useErrorBoundary,
} from "./index";

// Example components that can throw errors
const ErrorThrowingComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error("This is a test error from ErrorThrowingComponent");
  }
  return <div>Component rendered successfully!</div>;
};

const ApiErrorComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error("API request failed: 500 Internal Server Error");
  }
  return <div>API data loaded successfully!</div>;
};

const AuthErrorComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error("Authentication failed: Invalid credentials");
  }
  return <div>Authentication successful!</div>;
};

const DatabaseErrorComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error("Database connection failed: Connection timeout");
  }
  return <div>Database query executed successfully!</div>;
};

const FormErrorComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error("Form validation failed: Required field missing");
  }
  return <div>Form submitted successfully!</div>;
};

// Example of using the useErrorBoundary hook
const HookExampleComponent = () => {
  const { captureComponentError, captureApiError } = useErrorBoundary();
  const [error, setError] = useState<string | null>(null);

  const handleComponentError = () => {
    try {
      throw new Error("Component error from hook");
    } catch (err) {
      const eventId = captureComponentError(
        err as Error,
        "HookExampleComponent",
        { action: "button_click" },
      );
      setError(`Error captured with ID: ${eventId}`);
    }
  };

  const handleApiError = () => {
    try {
      throw new Error("API error from hook");
    } catch (err) {
      const eventId = captureApiError(
        err as Error,
        "/api/example",
        "POST",
        500,
        { requestData: { test: true } },
      );
      setError(`API Error captured with ID: ${eventId}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>useErrorBoundary Hook Example</CardTitle>
        <CardDescription>
          Examples of using the useErrorBoundary hook for manual error capture
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={handleComponentError} variant="outline">
            Trigger Component Error
          </Button>
          <Button onClick={handleApiError} variant="outline">
            Trigger API Error
          </Button>
        </div>
        {error && (
          <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Main examples component
export const ErrorBoundaryExamples = () => {
  const [componentError, setComponentError] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [dbError, setDbError] = useState(false);
  const [formError, setFormError] = useState(false);

  return (
    <div className="space-y-6 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Error Boundary Examples</h1>
        <p className="text-muted-foreground mt-2">
          Examples of different error boundary types and their usage
        </p>
      </div>

      {/* Page Error Boundary Example */}
      <PageErrorBoundary pageName="error-boundary-examples">
        <Card>
          <CardHeader>
            <CardTitle>Page Error Boundary</CardTitle>
            <CardDescription>
              Wraps the entire page content and handles page-level errors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This entire page is wrapped in a PageErrorBoundary. If any
              unhandled errors occur, they will be caught and displayed with
              page-specific context.
            </p>
          </CardContent>
        </Card>
      </PageErrorBoundary>

      {/* Component Error Boundary Example */}
      <Card>
        <CardHeader>
          <CardTitle>Component Error Boundary</CardTitle>
          <CardDescription>
            Handles errors within specific components with component context
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => setComponentError(!componentError)}
            variant={componentError ? "destructive" : "default"}
          >
            {componentError ? "Fix Component" : "Break Component"}
          </Button>
          <ComponentErrorBoundary
            componentName="ErrorThrowingComponent"
            context={{ testMode: true }}
          >
            <ErrorThrowingComponent shouldThrow={componentError} />
          </ComponentErrorBoundary>
        </CardContent>
      </Card>

      {/* API Error Boundary Example */}
      <Card>
        <CardHeader>
          <CardTitle>API Error Boundary</CardTitle>
          <CardDescription>
            Handles API-related errors with endpoint and method context
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => setApiError(!apiError)}
            variant={apiError ? "destructive" : "default"}
          >
            {apiError ? "Fix API" : "Break API"}
          </Button>
          <ApiErrorBoundary endpoint="/api/users" method="GET">
            <ApiErrorComponent shouldThrow={apiError} />
          </ApiErrorBoundary>
        </CardContent>
      </Card>

      {/* Auth Error Boundary Example */}
      <Card>
        <CardHeader>
          <CardTitle>Authentication Error Boundary</CardTitle>
          <CardDescription>
            Handles authentication-related errors with auth context
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => setAuthError(!authError)}
            variant={authError ? "destructive" : "default"}
          >
            {authError ? "Fix Auth" : "Break Auth"}
          </Button>
          <AuthErrorBoundary authContext="login">
            <AuthErrorComponent shouldThrow={authError} />
          </AuthErrorBoundary>
        </CardContent>
      </Card>

      {/* Database Error Boundary Example */}
      <Card>
        <CardHeader>
          <CardTitle>Database Error Boundary</CardTitle>
          <CardDescription>
            Handles database-related errors with operation and table context
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => setDbError(!dbError)}
            variant={dbError ? "destructive" : "default"}
          >
            {dbError ? "Fix Database" : "Break Database"}
          </Button>
          <DatabaseErrorBoundary operation="select" table="users">
            <DatabaseErrorComponent shouldThrow={dbError} />
          </DatabaseErrorBoundary>
        </CardContent>
      </Card>

      {/* Form Error Boundary Example */}
      <Card>
        <CardHeader>
          <CardTitle>Form Error Boundary</CardTitle>
          <CardDescription>
            Handles form-related errors with form name context
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => setFormError(!formError)}
            variant={formError ? "destructive" : "default"}
          >
            {formError ? "Fix Form" : "Break Form"}
          </Button>
          <FormErrorBoundary formName="user-registration">
            <FormErrorComponent shouldThrow={formError} />
          </FormErrorBoundary>
        </CardContent>
      </Card>

      {/* Hook Example */}
      <HookExampleComponent />

      {/* Usage Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Instructions</CardTitle>
          <CardDescription>
            How to use these error boundaries in your application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">1. Import the error boundaries:</h4>
            <pre className="bg-muted p-2 rounded text-sm overflow-x-auto">
              {`import {
  PageErrorBoundary,
  ComponentErrorBoundary,
  ApiErrorBoundary,
  AuthErrorBoundary,
  DatabaseErrorBoundary,
  FormErrorBoundary,
} from "@/components/ErrorBoundary";`}
            </pre>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">2. Wrap your components:</h4>
            <pre className="bg-muted p-2 rounded text-sm overflow-x-auto">
              {`<PageErrorBoundary pageName="dashboard">
  <ComponentErrorBoundary componentName="UserList">
    <UserList />
  </ComponentErrorBoundary>
</PageErrorBoundary>`}
            </pre>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">
              3. Use the hook for manual error capture:
            </h4>
            <pre className="bg-muted p-2 rounded text-sm overflow-x-auto">
              {`const { captureComponentError, captureApiError } = useErrorBoundary();

// Capture component errors
const eventId = captureComponentError(error, "MyComponent", { userId: "123" });

// Capture API errors
const eventId = captureApiError(error, "/api/users", "GET", 500);`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorBoundaryExamples;
