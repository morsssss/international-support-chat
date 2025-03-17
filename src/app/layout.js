import './globals.css';

export const metadata = {
  title: "DeepL Support Chat Demo",
  description: "Created by Ire & Ben"
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta name="description" content={metadata.description}/>
        <title>{metadata.title}</title>
        <link rel="icon" type="image/png" href="favicon.png"></link>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
``