import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'FLASH CONNECT | Université de Parakou', description: 'Portail numérique étudiant — prototype de démonstration' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>;
}
