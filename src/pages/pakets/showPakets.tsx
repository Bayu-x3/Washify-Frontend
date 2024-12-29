import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { PaketShow } from 'src/sections/pakets/view/show';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Paket Show - ${CONFIG.appName}`}</title>
      </Helmet>

      <PaketShow />
    </>
  );
}
