import { generateId } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-foreground">Yeko</h1>
            <span className="text-sm text-muted-foreground">Admin</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <svg
                className="w-5 h-5 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-label="Language selector"
              >
                <title>Language</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
                />
              </svg>
            </button>
            {/* <button
              type="button"
              className="px-4 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              Sign up
            </button> */}
            {/* <button
              type="button"
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Request Demo
            </button> */}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      {/* Top left abstract shapes */}
      <div className="absolute top-20 left-10 opacity-20">
        <div className="w-32 h-24 border-2 border-border rounded-lg transform rotate-12"></div>
        <div className="w-16 h-16 bg-muted rounded-full absolute -top-4 -right-4"></div>
      </div>

      {/* Wavy lines - top left */}
      <div className="absolute top-32 left-32 opacity-30">
        <svg
          width="120"
          height="60"
          viewBox="0 0 120 60"
          className="text-muted-foreground"
          aria-label="Decorative waves"
        >
          <title>Decorative waves</title>
          <path
            d="M10 30 Q30 10, 50 30 T90 30"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M15 40 Q35 20, 55 40 T95 40"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>

      {/* Bottom left dotted pattern */}
      <div className="absolute bottom-20 left-20">
        <div className="grid grid-cols-6 gap-3 opacity-40">
          {Array.from({ length: 24 }).map(() => (
            <div
              key={`dot-left-${generateId()}`}
              className="w-3 h-3 bg-primary rounded-full"
            ></div>
          ))}
        </div>
      </div>

      {/* Bottom left arrow box */}
      <div className="absolute bottom-32 left-40 opacity-30">
        <div className="w-20 h-16 border-2 border-border rounded-lg flex items-center justify-center">
          <svg
            className="w-8 h-8 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-label="Up arrow"
          >
            <title>Arrow up</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 11l5-5m0 0l5 5m-5-5v12"
            />
          </svg>
        </div>
      </div>

      {/* Right side illustration area */}
      <div className="absolute right-20 top-1/2 transform -translate-y-1/2 opacity-60">
        {/* Person illustration placeholder */}
        <div className="relative">
          {/* Laptop/desk setup */}
          <div className="w-32 h-20 bg-muted rounded-lg mb-4"></div>
          <div className="w-24 h-16 bg-secondary rounded-lg absolute top-2 left-4"></div>

          {/* Person silhouette */}
          <div className="w-16 h-24 bg-foreground rounded-t-full relative">
            <div className="w-8 h-8 bg-foreground rounded-full absolute -top-4 left-4"></div>
            {/* Arms */}
            <div className="w-6 h-12 bg-foreground rounded-full absolute -left-2 top-4 transform -rotate-12"></div>
            <div className="w-6 h-12 bg-foreground rounded-full absolute -right-2 top-4 transform rotate-12"></div>
          </div>
        </div>
      </div>

      {/* Right side decorative elements */}
      <div className="absolute top-40 right-32 opacity-20">
        <div className="w-24 h-20 border-2 border-border rounded-lg"></div>
        <div className="w-12 h-12 bg-muted rounded-full absolute -bottom-2 -right-2"></div>
      </div>

      {/* Bottom right dotted pattern */}
      <div className="absolute bottom-20 right-20">
        <div className="grid grid-cols-6 gap-3 opacity-40">
          {Array.from({ length: 24 }).map(() => (
            <div
              key={`dot-right-${generateId()}`}
              className="w-3 h-3 bg-primary rounded-full"
            ></div>
          ))}
        </div>
      </div>

      {/* Wavy lines - bottom right */}
      <div className="absolute bottom-40 right-40 opacity-30">
        <svg
          width="100"
          height="50"
          viewBox="0 0 100 50"
          className="text-muted-foreground"
          aria-label="Decorative wave"
        >
          <title>Decorative wave</title>
          <path
            d="M10 25 Q30 5, 50 25 T90 25"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>

      {/* Main content area */}
      <div className="relative z-20 flex items-center justify-center min-h-screen pt-20">
        {children}
      </div>
    </div>
  );
}
