import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { TrxCreate } from 'src/sections/transactions/view/create';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Transaction - ${CONFIG.appName}`}</title>
      </Helmet>

      <TrxCreate />
    </>
  );
}
