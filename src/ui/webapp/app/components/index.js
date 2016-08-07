import { createFactory, createElement, cloneElement, DOM } from 'react'
import _ from "lodash"

module.exports = {
    ...DOM
}

/**
 * Components
 */
export Icon from './Icon'

/**
 * Re-Exports
 */
import { Motion as motion, StaggeredMotion as smotion, TransitionMotion as tmotion } from 'react-motion'
export { spring } from 'react-motion'
export const Motion = createFactory(motion), StaggeredMotion = createFactory(smotion), TransitionMotion = createFactory(tmotion)