import { useEffect, useRef } from "react";
import type { ReactNode, RefObject } from "react";

export function ShopDialog({
  children,
  onDismiss,
  returnFocus,
  variant,
  title,
  closeLabel,
}: {
  children: ReactNode;
  onDismiss: () => void;
  returnFocus: RefObject<HTMLElement | null>;
  variant: "cart" | "success";
  title: string;
  closeLabel: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const element = dialog.current!;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    const trigger = returnFocus.current;
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      trigger?.focus({ preventScroll: true });
    };
  }, [returnFocus]);

  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, [variant]);

  return (
    <dialog
      ref={dialog}
      className={`shop-dialog shop-dialog--${variant}`}
      aria-labelledby="shop-dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        onDismiss();
      }}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const focusable = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>(
            'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])',
          ),
        ).filter((element) => element.getClientRects().length > 0);
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement;
        if (!first) {
          event.preventDefault();
          heading.current?.focus();
          return;
        }
        if (
          event.shiftKey &&
          (active === first || !focusable.includes(active as HTMLElement))
        ) {
          event.preventDefault();
          last.focus();
        } else if (
          !event.shiftKey &&
          (active === last || !focusable.includes(active as HTMLElement))
        ) {
          event.preventDefault();
          first.focus();
        }
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom
        )
          onDismiss();
      }}
    >
      <div className="shop-dialog-header">
        <h2 id="shop-dialog-title" ref={heading} tabIndex={-1}>
          {title}
        </h2>
        <button
          className="shop-icon-button"
          type="button"
          onClick={onDismiss}
          aria-label={closeLabel}
        >
          ×
        </button>
      </div>
      {children}
    </dialog>
  );
}
