// app/[locale]/blog/layout.tsx

import type { ReactNode } from 'react';
import { HomeLayout } from 'fumadocs-ui/home-layout';
import 'fumadocs-ui/style.css';

export default function BlogLayout({
  children,
}: {
  children: ReactNode;
}): React.ReactElement {
  return (
    <HomeLayout>
      <div className="blog-container">
        {children}
      </div>
      <Footer />
    </HomeLayout>
  );
}

function Footer(): React.ReactElement {
  return (
    <footer className="mt-auto border-t bg-card py-12 text-secondary-foreground">
      <div className="container flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-sm font-semibold">Netflow</p>
          <p className="text-xs">
            Built with ❤️ by{' '}
            <a
              href="/"
              rel="noreferrer noopener"
              target="_blank"
              className="font-medium"
            >
              Adel
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}