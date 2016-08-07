import { Component, PropTypes } from 'react'
import { fact, div, Motion, spring } from 'app/components'

import Player from './Player'
import Target from './Target'
import Mover from './Mover'
import Switcher from './Switcher'
import Wall from './Wall'
import Key from './Key'
import Port from './Port'

class Piece extends Component {

    /**
     * Begin listening to DOM events as this component is rendered into DOM.
     */
    componentWillMount() {
        window.addEventListener('mousemove', this.drag)
        window.addEventListener('mouseup', this.dragEnd)
    }

    /**
     * Destroy all event listeners that are attacked to this components before it
     * leaves the DOM.
     */
    componentWillUnmount() {
        window.removeEventListener('mousemove', this.drag)
        window.removeEventListener('mouseup', this.dragEnd)
    }

    /**
     * Specify that this component is currently being dragged.
     * 
     * @param e
     */
    dragStart = e => {
        this.dragging = true
        this._startPoint = {
            x: e.pageX,
            y: e.pageY
        }
        this.setState({
            scale: 1.1
        })
    }

    /**
     * If this component is being dragged, and the mouse moves - move the
     * component 1/8th of the mouses delta.
     * 
     * @param e
     */
    drag = e => {
        if (this.dragging) {
            const {x, y} = this._startPoint
            const getDiff = diff => diff / 8

            this.setState({
                top: getDiff(e.pageY - y),
                left: getDiff(e.pageX - x)
            })
        }
    }

    /**
     * Specify that this component is no longer being dragged.
     * Reset its position on the board.
     * 
     * @param e
     */
    dragEnd = e => {
        this.dragging = false
        this.setState({
            top: 0,
            left: 0,
            scale: 1
        })
    }

    /**
     * Determine what kind of piece should be rendered and return the
     * HTML generators to produce that piece.
     * 
     * @returns HTML generators.
     */
    render() {
        const {type} = this.props
        const {top = 0, left = 0, scale = 1} = this.state || {}

        const springConf = {
            stiffness: this.dragging ? 1000 : 200,
            damping: this.dragging ? 40 : 10
        }

        return (
            Motion({
                defaultStyle: {top, left, scale},
                style: {
                    top: spring(top, springConf),
                    left: spring(left, springConf),
                    scale: spring(scale, springConf)
                }
            },
                ({top, left, scale}) => (
                    div({
                            className: '_wrapper',

                            onMouseDown: this.dragStart,

                            style: {
                                WebkitTransform: `scale(${scale})`,
                                top,
                                left,
                                ...(this.dragging ? {zIndex: 1000} : {})}
                        },
                        this.getPiece(type)
                    )
                )
            )
        )
    }

    /**
     * Piece map. Returns a configured Piece React node depending on
     * the type of the current piece.
     * 
     * @param piece
     * @returns React Node
     */
    getPiece(piece) {
        switch (piece) {
            case "s":
            case "S":
                return Player()

            case "t":
            case "T":
                return Target()

            case "x":
            case "X":
                return Wall()

            case "u":
                return Mover({trigger: 0, direction: 1})

            case "d":
                return Mover({trigger: 0, direction: 2})

            case "l":
                return Mover({trigger: 0, direction: 3})

            case "r":
                return Mover({trigger: 0, direction: 4})

            case "U":
                return Mover({trigger: 1, direction: 1})

            case "D":
                return Mover({trigger: 1, direction: 2})

            case "L":
                return Mover({trigger: 1, direction: 3})

            case "R":
                return Mover({trigger: 1, direction: 4})

            case "h":
            case "H":
                return Switcher({trigger: 0, active: piece == 'H'})

            case "v":
            case "V":
                return Switcher({trigger: 1, active: piece == 'V'})

            case "k":
            case "K":
                return Key({id: this.props.id})

            case "p":
            case "P":
                return Port({active: piece == "P"})

            default:
                return null
        }
    }
}
export default fact(Piece)