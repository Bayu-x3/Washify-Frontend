import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

import { Main } from './main';
import { layoutClasses } from '../classes';
import { NavMobile, NavDesktop } from './nav';
import { navData } from '../config-nav-dashboard';
import endpoints from '../../contants/apiEndpoint';
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

  // Function to start voice recognition
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
      
        // Mapping commands to URLs
        const commandMap: Record<string, string> = {
          'open page user': '/user',
          'open create user': '/user/create-user',
          'go to dashboard': '/dashboard',
          'open page outlets': '/outlets',
          'open create outlets': '/outlets/create-outlet',
          'open page members': '/members',
          'open create members': '/members/create-member',
          'open page pakets': '/pakets',
          'open create pakets': '/pakets/create-paket',
        };
      
        const targetUrl = commandMap[transcript];
        if (targetUrl) {
          window.location.href = targetUrl;
        } else {
          console.warn('Command not recognized:', transcript);
        }
      };
      

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
      };

      recognition.onend = () => {
        console.log('Voice recognition stopped.');
      };

      recognition.start();
    }
  };

  const refreshToken = async () => {
    try {
      const response = await fetch(endpoints.refresh, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const newToken = data.token;
        if (newToken) {
          localStorage.setItem('access_token', newToken);
          console.log('Token refreshed successfully:', newToken);
        } else {
          console.error('No token received during refresh');
        }
      } else {
        console.error('Failed to refresh token:', response.statusText);
      }
    } catch (error) {
      console.error('Error during token refresh:', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(refreshToken, 300000); // 5 Menit
    return () => clearInterval(interval); 
  }, []);

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
                {/* Microphone button for voice recognition */}
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
