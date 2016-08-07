import { Component } from 'react'
import { fact, div, Icon } from 'app/components'

/**
 * Piece type: Target
 */
class Target extends Component {
    render() {

        return (
            div({className: '_piece target'},
                Icon({icon: 'target'})
            )
        )
    }
}

export default fact(Target)