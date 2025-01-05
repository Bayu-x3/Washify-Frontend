import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { TrxShow } from 'src/sections/transactions/view/show';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Transaction - ${CONFIG.appName}`}</title>
      </Helmet>

      <TrxShow />
    </>
  );
}
