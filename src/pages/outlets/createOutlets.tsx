import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { OutletCreate } from 'src/sections/outlets/view/create';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Outlets Create - ${CONFIG.appName}`}</title>
      </Helmet>

      <OutletCreate />
    </>
  );
}
