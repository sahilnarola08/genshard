import { createAction } from '@reduxjs/toolkit'
import { ExtendedProject } from './types'

export const changeCurrentProject = createAction<ExtendedProject | undefined>('market/changeCurrentProject')
  