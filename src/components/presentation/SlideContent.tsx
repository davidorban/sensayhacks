import { ReactNode } from 'react';

interface TitleProps {
  children: ReactNode;
}

export function Title({ children }: TitleProps) {
  return (
    <h1 className="text-4xl font-bold mb-8">{children}</h1>
  );
}

interface SubtitleProps {
  children: ReactNode;
}

export function Subtitle({ children }: SubtitleProps) {
  return (
    <h2 className="text-2xl font-semibold mb-6 text-gray-300">{children}</h2>
  );
}

interface BulletListProps {
  items: ReactNode[];
  className?: string;
}

export function BulletList({ items, className = '' }: BulletListProps) {
  return (
    <ul className={`space-y-4 ${className}`}>
      {items.map((item, index) => (
        <li key={index} className="flex items-start">
          <span className="mr-2 mt-1.5">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language = 'typescript' }: CodeBlockProps) {
  return (
    <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
      <code className={`language-${language}`}>
        {code}
      </code>
    </pre>
  );
}
