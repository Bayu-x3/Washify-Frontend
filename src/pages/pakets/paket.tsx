import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { PaketView } from 'src/sections/pakets/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Pakets - ${CONFIG.appName}`}</title>
      </Helmet>

      <PaketView />
    </>
  );
}
