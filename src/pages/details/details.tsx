import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { DetailsView } from 'src/sections/details/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Details - ${CONFIG.appName}`}</title>
      </Helmet>

      <DetailsView />
    </>
  );
}
