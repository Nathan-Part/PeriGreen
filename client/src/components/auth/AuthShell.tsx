import type { ReactNode } from 'react';
import { Leaf } from 'lucide-react';

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export default function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <section className="auth-shell">
      <aside className="auth-shell__showcase">
        <div>
          <div className="auth-shell__brand">
            <Leaf size={20} />
            <span>PeriGreen</span>
          </div>
          <div className="auth-shell__badge">
            <Leaf size={14} />
            Plateforme IT durable
          </div>
          <h1 className="auth-shell__title">{title}</h1>
          <p className="auth-shell__subtitle">{subtitle}</p>
        </div>

        <ul className="auth-shell__list">
          <li>
            <span className="auth-shell__dot" />
            Espaces dedies utilisateur et administrateur
          </li>
          <li>
            <span className="auth-shell__dot" />
            Suivi clair du cycle reservation et pret
          </li>
          <li>
            <span className="auth-shell__dot" />
            Flux IT durable pour les equipes du campus
          </li>
        </ul>
      </aside>

      <div className="auth-shell__form-wrap">{children}</div>
    </section>
  );
}
