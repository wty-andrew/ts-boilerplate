import { ActionIcon, useMantineColorScheme } from '@mantine/core'
import { IconSun, IconMoon } from '@tabler/icons-react'

import classes from './index.module.css'

const ColorModeSwitch = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const Icon = colorScheme === 'dark' ? IconSun : IconMoon

  return (
    <ActionIcon
      onClick={() => toggleColorScheme()}
      size="lg"
      radius="xl"
      className={classes.colorModeSwitch}
    >
      <Icon size="1.2rem" />
    </ActionIcon>
  )
}

export default ColorModeSwitch
