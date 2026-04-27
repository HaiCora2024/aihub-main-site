import "react";

declare module "react" {
  interface HTMLAttributes<T> {
    "tool-name"?: string;
    "tool-description"?: string;
    "tool-param-description"?: string;
  }
}
