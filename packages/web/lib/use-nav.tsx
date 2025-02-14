"use client";
import {
  ComponentPropsWithoutRef,
  createContext,
  forwardRef,
  PropsWithChildren,
  Suspense as ReactSuspense,
  TransitionStartFunction,
  useCallback,
  useContext,
  useTransition,
} from "react";
import { Link as NextLink, useRouter } from "i18n/routing";
import { Loader2Icon } from "lucide-react";

interface PendingContextValue {
  isPending: boolean;
  startTransition: TransitionStartFunction;
}
const PendingContext = createContext<PendingContextValue>(
  {} as PendingContextValue,
);

const PendingProvider = ({ children }: { children: React.ReactNode }) => {
  const [isPending, startTransition] = useTransition();
  return (
    <PendingContext.Provider value={{ isPending, startTransition }}>
      {children}
      {isPending && (
        <div className="fixed bottom-5 right-5 p-2 shadow border rounded-full">
          <Loader2Icon className="w-4 h-4 animate-spin" />
        </div>
      )}
    </PendingContext.Provider>
  );
};

const Suspense = ({
  children,
  fallback,
}: PropsWithChildren<{ fallback: React.ReactNode }>) => {
  const { isPending } = useContext(PendingContext);
  return (
    <ReactSuspense fallback={fallback}>
      {isPending ? fallback : children}
    </ReactSuspense>
  );
};

const useNav = () => {
  const router = useRouter();
  const { startTransition, isPending } = useContext(PendingContext);
  const navigate = useCallback(
    (path: ComponentPropsWithoutRef<typeof NextLink>["href"]) => {
      if (path) {
        startTransition(async () => {
          router.push(path.toString());
        });
      }
    },
    [router, startTransition],
  );
  return { navigate, isPending };
};

const Link = forwardRef<
  HTMLAnchorElement,
  ComponentPropsWithoutRef<typeof NextLink>
>(({ onClick, ...props }, ref) => {
  const { navigate } = useNav();
  return (
    <NextLink
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        navigate(props.href);
        onClick?.(e);
      }}
      {...props}
    />
  );
});

Link.displayName = NextLink.displayName;

export { Link, PendingProvider, useNav, Suspense };
