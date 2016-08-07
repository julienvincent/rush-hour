import { Component, PropTypes } from 'react'
import { fact, div, Motion, spring } from 'app/components'

import Header from 'app/containers/Header/Header'
import Menu from 'app/containers/Menu/Menu'
import Game from 'app/containers/Game/Game'

class Container extends Component {

    /**
     * Specify what data child components have access to
     */
    static childContextTypes = {
        menu: PropTypes.object,
        exit: PropTypes.func
    }

    /**
     * Define the data objects children can use and call on.
     */
    getChildContext() {
        return {
            menu: {
                show: () => this.setState({menu: true, moveMenu: false}),
                hide: () => this.setState({menu: false, moveMenu: false}),
                moveMenu: y => this.moveMenu(y),
                dragging: () => this.dragging,
                dragStart: (e) => this.dragStart(e),
                drag: (e) => this.drag(e),
                dragEnd: (e) => this.dragEnd(e),
                isOpen: () => (this.state || {}).menu
            },

            exit: () => this.setState({exiting: true})
        }
    }

    /**
     * Set up the component with some default state
     */
    constructor() {
        super()

        this.state = {
            settings: {
                uni: true,
                easy: false,

                keys: {
                    down: "k",
                    up: "j",
                    left: "h",
                    right: "l"
                }
            },

            menu: false,
            moveMenu: false,
            exiting: false,

            shake: {
                top: 0,
                left: 0
            }
        }
    }

    /**
     * Start point for menu drag handler.
     * Called via context by the header component.
     * 
     * @param e
     */
    dragStart = e => {
        this.dragging = true
        this._startPoint = {
            y: e.pageY
        }
    }

    /**
     * Move the container and the menu to follow the cursor.
     * Called via context by the header component and via drag()
     * 
     * @param moveMenu - distance
     */
    moveMenu = moveMenu => {
        this.setState({
            moveMenu
        })
    }

    /**
     * Fired on mousemove. First determines if the user has begun dragging. If they have,
     * move the container and menu to follow their cursor.
     * 
     * @param e
     */
    drag = e => {
        const {menu = false} = this.state || {}

        if (this.dragging) {
            const y = this._startPoint.y - e.pageY * -1 * .8
            const reverseY = 150 + (e.pageY - this._startPoint.y)
            this.moveMenu(menu ? (reverseY > 0 ? reverseY : 0) : (y < 150 ? y : 150))
        }
    }

    /**
     * Fired on mouseup. First determines if the user had been dragging and if so,
     * fully opens or closes the menu
     * 
     * @param e
     */
    dragEnd = e => {
        const {moveMenu = false} = this.state || {}

        if (this.dragging) {
            this.setState({
                menu: moveMenu ? this.state.moveMenu >= 65 : true,
                moveMenu: false
            })
        }

        this.dragging = false
    }

    /**
     * Initialize some DOM listeners before this component mounts to DOM
     */
    componentWillMount() {
        window.addEventListener('mouseup', this.dragEnd)
        window.addEventListener('mousemove', this.drag)
    }

    /**
     * Destroy all listeners created before this component exits the DOM
     */
    componentWillUnmount() {
        window.removeEventListener('mouseup', this.dragEnd)
        window.removeEventListener('mousemove', this.drag)
    }

    /**
     * Update the current keymap with a new key.
     * Called via props by the menu component.
     * 
     * @param key
     * @param value
     */
    setKey = (key, value) => {
        if (!_.find(this.state.keys, val => val == value)) {
            this.setState({
                settings: {
                    ...this.state.settings,
                    keys: {
                        ...this.state.settings.keys,
                        [key]: value
                    }
                }
            })
        }
    }

    /**
     * Set some game setting's value.
     * Called via props by the menu component.
     * 
     * @param setting
     * @param value
     */
    setSetting = (setting, value) => {
        this.setState({
            settings: {
                ...this.state.settings,
                [setting]: value
            }
        })
    }

    /**
     * Shake the screen on an incorrect move. Only gets triggered when in easy mode.
     */
    shake = () => {
        this.setState({
            shake: {
                top: 0,
                left: -5
            }
        }, () => {
            setTimeout(() => {
                this.setState({
                    shake: {
                        top: 0,
                        left: 5
                    }
                }, () => {
                    setTimeout(() => {
                        this.setState({
                            shake: {
                                top: 0,
                                left: -5
                            }
                        }, () => {
                            setTimeout(() => {
                                this.setState({
                                    shake: {
                                        top: 0,
                                        left: 0
                                    }
                                })
                            }, 50)
                        })
                    }, 50)
                })
            }, 50)
        })
    }

    /**
     * Generate the HTML to be mounted in DOM
     * 
     * @returns HTML Generators
     */
    render() {
        const {exiting, moveMenu, menu, settings, shake: {top, left}} = this.state

        return (
            Motion({
                    defaultStyle: {opacity: 0, top: 0, left: 0},
                    style: {
                        opacity: spring(exiting ? 0 : 1, {stiffness: exiting ? 300 : 140}),
                        top: spring(menu || moveMenu || top ? moveMenu || top || 150 : 0),
                        left: spring(left)
                    },
                    onRest: () => {
                        if (window.java && exiting) java.exit()
                    }
                },
                ({opacity, top, left}) => (
                    div({
                            className: 'absolute',
                            style: {overflow: 'hidden'}
                        },
                        div({
                                className: 'container',
                                style: {
                                    opacity,
                                    WebkitTransform: `scale(${opacity}) translateY(${top}px) translateX(${left}px)`
                                },
                                onMouseDown: () => menu ? this.setState({menu: false}) : null
                            },
                            Header(),

                            Game({settings, shake: this.shake})
                        ),

                        Motion({
                                defaultStyle: {top: 0},
                                style: {top: spring((top - 150) / 8)}
                            },
                            ({top}) => (
                                div({
                                        className: 'menu-container',
                                        style: {
                                            display: opacity !== 1 ? 'none' : 'block',
                                            WebkitTransform: `translateY(${top}px)`
                                        }
                                    },
                                    Menu({settings, setKey: this.setKey, setSetting: this.setSetting})
                                )
                            )
                        )
                    )
                )
            )
        )
    }
}

export default fact(Container)