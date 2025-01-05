import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { TrxEdit } from 'src/sections/transactions/view/edit';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Transaction - ${CONFIG.appName}`}</title>
      </Helmet>

      <TrxEdit />
    </>
  );
}
