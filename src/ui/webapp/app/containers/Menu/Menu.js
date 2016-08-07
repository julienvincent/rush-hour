import { Component } from 'react'
import { fact, div, p, input } from 'app/components'

class Menu extends Component {

    /**
     * Generate the HTML to be mounted in DOM
     *
     * @returns HTML Generators
     */
    render() {
        const {settings: {keys, easy, uni}, setKey, setSetting} = this.props

        return (
            div({className: 'menu'},
                div({className: 'panel'}),

                div({className: 'panel keymap'},
                    ["up", "down", "left", "right"].map((type, key) => (
                            div({className: 'key', key},
                                div({className: 'label'},
                                    p({}, `${type}: `)
                                ),

                                div({className: 'input'},
                                    input({type: 'text', value: keys[type], onChange: e => setKey(type, e.target.value.substring(0, 1))})
                                )
                            )
                        )
                    )
                ),
                
                div({className: 'panel settings'},
                    div({className: `toggle${easy ? ' active' : ''}`, onClick: () => setSetting('easy', !easy)},
                        div({className: 'button'}),
                        
                        div({className: 'label'},
                            "Easy"
                        )
                    ),

                    div({className: `toggle${uni ? ' active' : ''}`, onClick: () => setSetting('uni', !easy)},
                        div({className: 'button'}),

                        div({className: 'label'},
                            "Uni-Mode"
                        )
                    )
                )
            )
        )
    }
}
export default fact(Menu)