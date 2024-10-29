import { Helmet } from 'react-helmet-async';

export function Head({ newtitle = '', newdescription = '', newkeywords = '' } ) {
  const title = newtitle || 'Bitacora';
  const description = newdescription || 'Bitacora';
  const keywords = newkeywords || 'Bitacora';

  return (
    <Helmet>
      <title>{title} | Bitacora</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
    </Helmet>
  );
}