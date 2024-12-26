import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { OutletView } from 'src/sections/outlets/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Outlets - ${CONFIG.appName}`}</title>
      </Helmet>

      <OutletView />
    </>
  );
}
