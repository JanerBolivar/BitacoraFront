import { Helmet } from 'react-helmet-async';

export function Head({ newtitle = '', newdescription = '', newkeywords = '' } ) {
  const title = newtitle || 'Bitácoras';
  const description = newdescription || 'Bitácoras';
  const keywords = newkeywords || 'Bitácoras';

  return (
    <Helmet>
      <title>{title} | Bitácoras</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
    </Helmet>
  );
}