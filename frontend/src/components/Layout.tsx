import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="app">
      <header className="header">
        <nav className="nav">
          <Link to="/" className="nav-brand" data-testid="nav-home">
            Task Manager
          </Link>
        </nav>
      </header>
      <main className="main">{children}</main>
    </div>
  );
}
