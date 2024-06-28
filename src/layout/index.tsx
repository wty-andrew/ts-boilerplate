import { AppShell, Box, Container, Stack, UnstyledButton } from '@mantine/core'
import { IconHome2, IconSettings } from '@tabler/icons-react'
import type { IconProps } from '@tabler/icons-react'
import type { ReactNode } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

import ColorModeSwitch from './color-mode-switch'
import classes from './index.module.css'

interface NavbarLinkProps {
  icon: (props: IconProps) => ReactNode
  to: string
}

const NavbarLink = ({ icon: Icon, to }: NavbarLinkProps) => (
  <NavLink to={to}>
    {({ isActive }) => (
      <UnstyledButton
        className={classes.link}
        data-active={isActive || undefined}
      >
        <Icon size="1.5rem" stroke={1.5} />
      </UnstyledButton>
    )}
  </NavLink>
)

const links = [
  { icon: IconHome2, to: '/' },
  { icon: IconSettings, to: '/settings' },
]

const Layout = () => {
  return (
    <AppShell
      header={{ height: 56 }}
      navbar={{ width: 80, breakpoint: 0 }}
      padding={0}
    >
      <AppShell.Header>
        <Container fluid className={classes.header}>
          <Box style={{ flexGrow: 1 }} />
          <ColorModeSwitch />
        </Container>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack align="center" justify="center" gap={2}>
          {links.map(({ icon, to }, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey:
            <NavbarLink key={index} icon={icon} to={to} />
          ))}
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}

export default Layout
