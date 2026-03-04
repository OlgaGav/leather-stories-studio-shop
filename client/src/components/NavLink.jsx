import { NavLink as RouterNavLink } from "react-router-dom";
import { forwardRef } from "react";
import { cn } from "../utils/helper";

const NavLink = forwardRef(function NavLink(
  { className, activeClassName, pendingClassName, to, ...props },
  ref
) {
  return (
    <RouterNavLink
      ref={ref}
      to={to}
      className={({ isActive, isPending }) =>
        cn(
          className,
          isActive && activeClassName,
          isPending && pendingClassName
        )
      }
      {...props}
    />
  );
});

NavLink.displayName = "NavLink";

export { NavLink };