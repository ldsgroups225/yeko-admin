export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-foreground">Yeko Admin</h1>
        <p className="text-xl text-muted-foreground max-w-md">
          Welcome to your admin dashboard. Please sign in to continue.
        </p>
        <div className="space-y-4">
          <a
            href="/sign-in"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
}
