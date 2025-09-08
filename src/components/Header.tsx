import { type ElementType, forwardRef, type ReactNode, useId } from "react";
import { cn } from "@/lib/utils/cn";

interface HeaderProps<T extends ElementType = "header"> {
  /** Render element (header, div, section...) */
  as?: T;
  title: string;
  /** Optional subtitle / description text */
  description?: string;
  /** Right-side content (actions, buttons, etc.) */
  trailing?: ReactNode;
  /** Left-side content (icon, breadcrumb, etc.) */
  leading?: ReactNode;
  /** Additional classes applied to the outer container */
  className?: string;
  /** Sizes adjust type scale for title & description */
  size?: "sm" | "md" | "lg" | "xl";
  /** Visual variant for different contexts */
  variant?: "default" | "card" | "bordered" | "elevated";
  /** Whether to show a subtle bottom border */
  showBorder?: boolean;
  /** Whether to add padding around the header */
  padded?: boolean;
}

/**
 * Enhanced reusable page/section header with design system integration.
 *
 * Example:
 * <Header
 *   title="Dashboard"
 *   description="Overview of your workspace"
 *   leading={<Breadcrumb />}
 *   trailing={<Button>New</Button>}
 *   variant="elevated"
 *   size="lg"
 * />
 */
export const Header = forwardRef<HTMLElement, HeaderProps>((props, ref) => {
  const {
    as: Component = "header",
    title,
    description,
    trailing,
    leading,
    className = "",
    size = "md",
    variant = "default",
    showBorder = false,
    padded = true,
    ...rest
  } = props;

  const uid = useId();
  const titleId = `hdr-title-${uid}`;
  const descId = description ? `hdr-desc-${uid}` : undefined;

  const sizeClasses: Record<
    NonNullable<HeaderProps["size"]>,
    { title: string; desc: string; spacing: string }
  > = {
    sm: { title: "text-xl font-semibold", desc: "text-sm", spacing: "gap-2" },
    md: { title: "text-2xl font-semibold", desc: "text-sm", spacing: "gap-3" },
    lg: { title: "text-3xl font-bold", desc: "text-base", spacing: "gap-4" },
    xl: { title: "text-4xl font-bold", desc: "text-lg", spacing: "gap-5" },
  };

  const variantClasses: Record<NonNullable<HeaderProps["variant"]>, string> = {
    default: "bg-background",
    card: "bg-card border border-border rounded-lg shadow-sm",
    bordered: "bg-background border-b border-border",
    elevated: "bg-card border border-border rounded-lg shadow-md",
  };

  return (
    <Component
      ref={ref as React.Ref<HTMLElement>}
      className={cn(
        // Base layout
        "flex flex-col sm:flex-row sm:items-center justify-between",
        // Spacing
        sizeClasses[size].spacing,
        // Variant styling
        variantClasses[variant],
        // Conditional styling
        showBorder && "border-b border-border",
        padded && "p-4 sm:p-6",
        // Responsive improvements
        "transition-colors duration-200",
        className,
      )}
      aria-labelledby={titleId}
      {...(descId ? { "aria-describedby": descId } : {})}
      {...rest}
    >
      <div className="flex items-start gap-3 min-w-0 flex-1">
        {leading && (
          <div className="flex-shrink-0 text-muted-foreground">{leading}</div>
        )}

        <div className="min-w-0 flex-1">
          <h1
            id={titleId}
            className={cn(
              "text-foreground tracking-tight leading-tight",
              sizeClasses[size].title,
              "truncate",
            )}
          >
            {title}
          </h1>

          {description && (
            <p
              id={descId}
              className={cn(
                "mt-1 text-muted-foreground tracking-normal leading-relaxed",
                sizeClasses[size].desc,
                "truncate",
              )}
            >
              {description}
            </p>
          )}
        </div>
      </div>

      {trailing && (
        <div className="flex items-center gap-2 flex-shrink-0 mt-2 sm:mt-0">
          {trailing}
        </div>
      )}
    </Component>
  );
});

Header.displayName = "Header";
export default Header;
