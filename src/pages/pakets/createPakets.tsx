import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { PaketCreate } from 'src/sections/pakets/view/create';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Paket Create - ${CONFIG.appName}`}</title>
      </Helmet>

      <PaketCreate />
    </>
  );
}
