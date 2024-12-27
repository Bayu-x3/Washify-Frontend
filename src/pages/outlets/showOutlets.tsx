import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { OutletShow } from 'src/sections/outlets/view/show';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Member Show - ${CONFIG.appName}`}</title>
      </Helmet>

      <OutletShow />
    </>
  );
}
