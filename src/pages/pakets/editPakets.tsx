import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { PaketEdit } from 'src/sections/pakets/view/edit';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Paket Edit - ${CONFIG.appName}`}</title>
      </Helmet>

      <PaketEdit />
    </>
  );
}
