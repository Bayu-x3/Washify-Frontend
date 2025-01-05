import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { TrxView } from 'src/sections/transactions/view/index';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Transaction - ${CONFIG.appName}`}</title>
      </Helmet>

      <TrxView />
    </>
  );
}
