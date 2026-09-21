import { Compass, ShieldCheck, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
export function Shell({
  children,
  onReset,
}: {
  children: ReactNode;
  onReset: () => void;
}) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to research
      </a>
      <header className="topbar">
        <button
          className="brand"
          onClick={onReset}
          aria-label="Fidelis new research"
        >
          <span className="brand-mark">F</span>FIDELIS
          <span className="alpha">ALPHA 001</span>
        </button>
        <nav aria-label="Workspace">
          <span className="nav-active">
            <Compass size={15} /> Research workspace
          </span>
          <a href="#governance">
            Governance <ArrowUpRight size={13} />
          </a>
        </nav>
        <span className="status">
          <span className="dot" /> Demonstration
        </span>
      </header>
      <main id="main">{children}</main>
      <footer id="governance">
        <span>
          <ShieldCheck size={16} /> Reproducible demo · Sanitized fixture ·
          Provider calls: 0
        </span>
        <span>Research support. No investment recommendation.</span>
      </footer>
    </>
  );
}
