import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

import { Main } from './main';
import { layoutClasses } from '../classes';
import { NavMobile, NavDesktop } from './nav';
import { navData } from '../config-nav-dashboard';
import { Searchbar } from '../components/searchbar';
import { _workspaces } from '../config-nav-workspace';
import { MenuButton } from '../components/menu-button';
import { LayoutSection } from '../core/layout-section';
import { HeaderSection } from '../core/header-section';
import { AccountPopover } from '../components/account-popover';

export type DashboardLayoutProps = {
  sx?: SxProps<Theme>;
  children: React.ReactNode;
  header?: {
    sx?: SxProps<Theme>;
  };
};

export function DashboardLayout({ sx, children, header }: DashboardLayoutProps) {
  const theme = useTheme();

  const [navOpen, setNavOpen] = useState(false);
  const layoutQuery: Breakpoint = 'lg';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
if (!('webkitSpeechRecognition' in window)) {
  console.error('Browser does not support Web Speech API');
} else {
  const recognition = new window.webkitSpeechRecognition(); // eslint-disable-line new-cap
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event: any) => {
    let transcript = event.results[0][0].transcript.trim().toLowerCase();
    transcript = transcript.replace(/[.,!?]/g, '');
    console.log('Recognized:', transcript);
  
    switch (transcript) {
      case 'open page user':
        window.location.href = '/user';
        break;
      case 'open create user':
        window.location.href = '/user/create-user';
        break;
      case 'go to dashboard':
        window.location.href = '/dashboard';
        break;
      case 'open page outlets':
        window.location.href = '/outlets';
        break;
      case 'open create outlets':
        window.location.href = '/outlets/create-outlet';
        break;
      default:
        console.warn('Command not recognized:', transcript);
        break;
    }
  };
  
  
  

  recognition.onerror = (event: any) => {
    console.error('Speech recognition error:', event.error);
  };

  recognition.onend = () => {
    console.log('Voice recognition stopped.');
  };

  // Mulai pengenalan suara
  recognition.start();
}

  };

  return (
    <LayoutSection
      headerSection={
        <HeaderSection
          layoutQuery={layoutQuery}
          slotProps={{
            container: {
              maxWidth: false,
              sx: { px: { [layoutQuery]: 5 } },
            },
          }}
          sx={header?.sx}
          slots={{
            topArea: (
              <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
                This is an info Alert.
              </Alert>
            ),
            leftArea: (
              <>
                <MenuButton
                  onClick={() => setNavOpen(true)}
                  sx={{
                    ml: -1,
                    [theme.breakpoints.up(layoutQuery)]: { display: 'none' },
                  }}
                />
                <NavMobile
                  data={navData}
                  open={navOpen}
                  onClose={() => setNavOpen(false)}
                  workspaces={_workspaces}
                />
              </>
            ),
            rightArea: (
              <Box gap={1} display="flex" alignItems="center">
                <Searchbar />
                {/* Tombol mikrofon untuk pengenalan suara */}
                <IconButton
                  color={isListening ? 'primary' : 'default'}
                  onClick={startListening}
                  title="Start voice command"
                >
                  <Iconify width={24} icon="solar:microphone-bold-duotone" />
                </IconButton>
                <AccountPopover
                  data={[
                    {
                      label: 'Settings',
                      href: '#',
                      icon: <Iconify width={22} icon="solar:settings-bold-duotone" />,
                    },
                  ]}
                />
              </Box>
            ),
          }}
        />
      }
      sidebarSection={
        <NavDesktop data={navData} layoutQuery={layoutQuery} workspaces={_workspaces} />
      }
      footerSection={null}
      cssVars={{
        '--layout-nav-vertical-width': '300px',
        '--layout-dashboard-content-pt': theme.spacing(1),
        '--layout-dashboard-content-pb': theme.spacing(8),
        '--layout-dashboard-content-px': theme.spacing(5),
      }}
      sx={{
        [`& .${layoutClasses.hasSidebar}`]: {
          [theme.breakpoints.up(layoutQuery)]: {
            pl: 'var(--layout-nav-vertical-width)',
          },
        },
        ...sx,
      }}
    >
      <Main>{children}</Main>
    </LayoutSection>
  );
}
