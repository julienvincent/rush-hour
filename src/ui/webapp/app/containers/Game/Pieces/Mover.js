import { Component } from 'react'
import { fact, div, Icon } from 'app/components'

/**
 * Piece type: Key
 */
class Mover extends Component {
    render() {
        const {direction, trigger} = this.props
        return (
            div({className: `_piece mover ${this.parse(direction)}`},
                Icon({icon: `chevron-${this.parse(direction)}-thin`}),
                
                div({className: `trigger ${trigger === 0 ? 'horizontal' : 'vertical'}`},
                    div(),
                    div()
                )
            )
        )
    }

    /**
     * Determine what kind of mover this piece is.
     * Returns text representing a css class name.
     * 
     * @param direction
     * @returns text
     */
    parse(direction) {
        switch (direction) {
            case 1:
                return "up"

            case 2:
                return "down"

            case 3:
                return "left"

            case 4:
                return "right"
        }
    }
}

export default fact(Mover)