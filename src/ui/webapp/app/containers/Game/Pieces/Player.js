import { Component, PropTypes } from 'react'
import { fact, div } from 'app/components'

/**
 * Piece type: Player
 */
class Player extends Component {
    render() {
        return (
            div({className: '_piece player'})
        )
    }
}

export default fact(Player)