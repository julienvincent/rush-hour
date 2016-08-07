import { Component, PropTypes } from 'react'
import { fact, div, p, Icon } from 'app/components'

class Header extends Component {

    /**
     * Specify what context this component is allowed access to.
     */
    static contextTypes = {
        menu: PropTypes.object,
        exit: PropTypes.func
    }

    /**
     * Tell the Java stage that the user has begun dragging. All additional logic is handled
     * via the JavaFX stage.
     * 
     * @param e
     */
    onMouseDown = e => {
        if (window.java) {
            java.startDrag()
        }
    }

    /**
     * Get the title of the board before the component mounts in the DOM
     */
    componentWillMount() {
        if (window.java) {
            this.setState({
                title: java.getBoard().getTitle()
            })
        }
    }

    /**
     * Tell the container component that the user has begun dragging the menu.
     * Stop the press action from bubbling up to the containing DOM node.
     * 
     * @param e
     */
    menuPressed = e => {
        this.context.menu.dragStart(e)
        e.stopPropagation()
    }

    /**
     * Generate the HTML to be mounted in DOM
     *
     * @returns HTML Generators
     */
    render() {
        const {title, maximized = false} = this.state || {}
        const {menu: {show, hide, isOpen, dragging}, exit} = this.context

        return (
            div({className: 'header', onMouseDown: this.onMouseDown},
                div({className: 'side left'},
                    div({
                            className: 'header-button',
                            onMouseDown: this.menuPressed,
                            onClick: e => {
                                if (dragging) {
                                    return
                                }
                                isOpen() ? hide() : show()
                            }
                        },
                        Icon({icon: 'chevron-down-thin'})
                    ),

                    div({className: 'title'},
                        p({}, title || "Unknown")
                    )
                ),

                div({className: 'side right'},
                    div({className: 'header-button', onClick: this.toggleMaximized},
                        Icon({icon: maximized ? 'minimize' : 'maximize'})
                    ),

                    div({className: 'header-button', onClick: exit},
                        Icon({icon: 'close-thin'})
                    )
                )
            )
        )
    }

    toggleMaximized = () => {
        if (window.java) {
            java.toggleMaximized()
        }

        this.setState({
            maximized: !(this.state || {}).maximized
        })
    }
}

export default fact(Header)