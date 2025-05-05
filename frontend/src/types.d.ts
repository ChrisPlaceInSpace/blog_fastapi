import 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      form: React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;
    }
  }
} 