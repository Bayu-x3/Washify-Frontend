import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { DetailsCreate } from 'src/sections/details/view/create';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Members Create - ${CONFIG.appName}`}</title>
      </Helmet>

      <DetailsCreate />
    </>
  );
}
