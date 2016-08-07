import { Component } from 'react'
import { fact, div, Icon } from 'app/components'

/**
 * Piece type: Port
 */
class Port extends Component {
    render() {
        const {active} = this.props

        return (
            div({className: `_piece port${!active ? ' inactive-port' : ''}`},
                Icon({icon: 'close-thin'})
            )
        )
    }
}

export default fact(Port)