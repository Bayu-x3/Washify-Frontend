import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { OutletEdit } from 'src/sections/outlets/view/edit';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Outlets Edit - ${CONFIG.appName}`}</title>
      </Helmet>

      <OutletEdit />
    </>
  );
}
