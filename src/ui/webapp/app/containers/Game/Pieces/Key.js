import { Component } from 'react'
import { fact, div, Icon } from 'app/components'

/**
 * Piece type: Key
 */
class Key extends Component {
    render() {
        const {id} = this.props
        const active = window.java ? window.java.isKeyAvailable(id) : true

        return (
            div({className: `_piece key${!active ? ' inactive-key' : ''}`},
                Icon({icon: 'key2'})
            )
        )
    }
}

export default fact(Key)