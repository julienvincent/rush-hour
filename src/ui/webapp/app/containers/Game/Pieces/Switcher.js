import { Component } from 'react'
import { fact, div } from 'app/components'

/**
 * Piece type: Switcher
 */
class Switcher extends Component {
    render() {
        const {trigger, active} = this.props

        return (
            div({className: `_piece switcher ${!active ? 'inactive-switcher' : ''}`},
                div({className: `trigger ${trigger === 0 ? 'horizontal' : 'vertical'}`},
                    div(),
                    div()
                )
            )
        )
    }
}

export default fact(Switcher)