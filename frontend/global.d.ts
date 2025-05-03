declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.png';
declare module '*.svg';
declare module '*.jpeg';
declare module '*.jpg';

interface ImportMetaEnv {
  VITE_API_URL: string;
}

interface ImportMeta {
  env: ImportMetaEnv;
}
