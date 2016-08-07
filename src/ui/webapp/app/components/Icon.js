import { Component, PropTypes, createFactory as fact } from 'react'
import { div, i } from 'app/components'

/**
 * Helper component to render an icon from icomoon.io
 */
class Icon extends Component {

    /**
     * Specify what props this component requires and uses.
     * 
     * @type {{driver: *, icon: *, direction: *}}
     */
    static propTypes = {
        driver: PropTypes.string,
        icon: PropTypes.string.isRequired,
        direction: PropTypes.string
    }

    /**
     * Before this component receives new props, determine if those
     * props should cause a re-render or not.
     * 
     * @param props
     */
    componentWillReceiveProps(props) {
        if (props !== this.props) {
            this.forceUpdate()
        }
    }

    /**
     * Render this component to DOM
     * 
     * @returns HTML generators
     */
    render() {
        return i({...this.props, ...{className: `icon-${this.props.icon} ${this.props.className || ''}`}},
            this.props.children
        )
    }
}
export default fact(Icon)