import { Component } from 'react'
import { fact, div } from 'app/components'

/**
 * Piece type: Wall
 */
class Wall extends Component {
    render() {
        return (
            div({className: '_piece wall'})
        )
    }
}

export default fact(Wall)