import type { SVGProps } from "react";

interface IconProps extends SVGProps<SVGSVGElement> {
  name: string;
}

export function Icon({ name, ...props }: IconProps) {
  return <svg {...props} role="img" aria-label={name} />;
}
