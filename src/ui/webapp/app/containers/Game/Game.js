import { Component, PropTypes } from 'react'
import { _, fact, div, TransitionMotion, Motion, spring } from 'app/components'

import Piece from './Pieces/Piece'

class Game extends Component {

    /**
     * Specify what context types this component is allowed access to.
     */
    static contextTypes = {
        exit: PropTypes.func
    }

    /**
     * Initialize this component with some default state regarding the generated board,
     * the scale of each piece in regard to the blocks on the board and a keymap to
     * match key presses to directions that the Java game logic can understand
     */
    constructor() {
        super()

        this.state = {
            board: {
                rows: 1,
                columns: 1,
                pieces: null,
                style: {}
            },

            keyMap: ["j", "k", "h", "l"],

            scale: .6
        }
    }

    /**
     * Once the component has mounted in DOM, start listening to some DOM events and fetch the current board.
     */
    componentDidMount() {
        window.addEventListener('keypress', this.handleKeyPress)
        window.addEventListener('resize', this.handleResize)

        setTimeout(() => {
            this.getBoard()
        }, 200)
    }

    /**
     * Resize the scene to fit the board
     */
    setSceneSize() {
        const {board: {style: {width}, columns}} = this.state

        if (window.java) {
            java.setStageWidth((width * columns) + 40)
        }
    }

    /**
     * When the JavaFX WebView triggers a resize event, recalculate the board layout.
     * Prevents the board from getting squashed or rendered outside the view port.
     */
    handleResize = () => {
        if (this._board) {
            const {board: {rows, columns}} = this.state
            const _board = this._parseBoard(this._board, rows, columns)

            this.setState({
                board: _board
            })
        }
    }

    /**
     * When the user presses a keyboard key, determine if that key is mapped to a direction,
     * and if it is - attempt to move the player in that direction.
     *
     * The direction to move is determined via the keymap initialized in state.
     *
     * @param e
     */
    handleKeyPress = e => {
        const {settings: {keys: {up, down, left, right}}} = this.props

        switch (e.keyCode) {
            case down.charCodeAt(0):
                this.movePlayer(0)
                break
            case up.charCodeAt(0):
                this.movePlayer(1)
                break
            case left.charCodeAt(0):
                this.movePlayer(2)
                break
            case right.charCodeAt(0):
                this.movePlayer(3)
                break
            case "q".charCodeAt(0):
                this.context.exit()
                break
        }
    }

    /**
     * Move the player on the board in a certain direction and respond to the code that is returned.
     *
     * -2: The game has been lost. Calls lost()
     * -1: Incorrect move. Calls lost() or shake() depending if in easy mode or not
     * 1: The game has been won. Calls won()
     *
     * If not currently running in a Java environment, will mock move the piece
     * on block 14, 20px to the left or right.
     *
     * @param direction
     */
    movePlayer(direction) {
        const {keyMap} = this.state
        const {settings: {easy}} = this.props

        if (window.java) {
            const code = java.getBoard().movePlayer(keyMap[direction])

            switch (code) {
                case -1:
                    if (easy) {
                        this.props.shake()
                    } else {
                        this.lost()
                    }
                    break
                case 1:
                    this.won()
                    break
                case -2:
                    this.lost()
                    break
            }

            this.getBoard()
        } else {
            const board = this.state.board

            board.pieces[14].left = board.pieces[14].left + (keyMap[direction] === 'l' ? 20 : -20)

            this.setState({
                board
            })
        }
    }

    /**
     * If in uni mode, exit the application as according to the requirements.
     *
     * If not in uni mode, render a DOM node telling the user they have won and asking
     * weather or not they want to start a new game.
     */
    won() {
        console.log("You won!")
        if (this.props.settings.uni) {
            this.context.exit()
        }
    }

    /**
     * If in uni mode, exit the application as according to the requirements.
     *
     * If not in uni mode, render a DOM node telling the user they have lost and asking
     * weather or not they want to try again.
     */
    lost() {
        console.log("You lost!")
        this.context.exit()
    }

    /**
     * Before this component gets removed from the DOM, destroy all DOM listeners that apply to it.
     */
    componentWillUnmount() {
        window.removeEventListener('keypress', this.handleKeyPress)
        window.removeEventListener('resize', this.handleResize)
    }

    /**
     * If running in a Java environment, get the current board as a String[] and render it to DOM.
     *
     * If not running in a Java environment, mock a String[] board and render it to DOM.
     */
    getBoard() {
        if (window.java) {
            const board = java.getBoard()
            this._board = board

            this.setState({
                board: this._parseBoard(
                    board.toData(),
                    board.getDimensions()[0],
                    board.getDimensions()[1]
                )
            })
        } else {
            const col = 6, row = 6
            const board = _.map(_.range(0, col * row), item => `${item};s`)
            this._board = board

            this.setState({
                board: this._parseBoard(board, row, col)
            })
        }
    }

    /**
     * Parses the String[] board into an array of JavaScript objects that define the pieces dimensions,
     * index, id and type
     *
     * @param board
     * @param rows
     * @param columns
     * @returns {*}
     */
    _parseBoard(board, rows, columns) {
        const pieces = []
        const boardNode = this.refs.board

        if (boardNode) {
            let style = {}
            let leftCenter = 0
            let topCenter = 0

            const {scale} = this.state
            const _scale = (1 - scale) / 2

            const maxHeight = boardNode.clientHeight
            const maxWidth = boardNode.clientWidth

            const maxBlockHeight = maxHeight / rows
            const maxBlockWidth = maxWidth / columns

            if (maxBlockHeight >= maxBlockWidth) {
                topCenter = (maxHeight - (maxBlockWidth * rows)) / 2
                style = {
                    width: maxBlockWidth,
                    height: maxBlockWidth
                }
            } else {
                leftCenter = (maxWidth - (maxBlockHeight * columns)) / 2
                style = {
                    width: maxBlockHeight,
                    height: maxBlockHeight
                }
            }

            _.forEach(board, (block, index) => {
                block = _.map((block + "").split("|"), item => {
                    item = item + ""
                    const split = item.split(";")

                    return {
                        id: split[0],
                        type: split[1]
                    }
                })

                const row = Math.floor(index / columns)
                const col = (index % columns)

                _.forEach(block, piece => {
                    pieces.push({
                        top: (row * style.height) + topCenter + (style.height * _scale),
                        left: (col * style.width) + leftCenter + (style.width * _scale),
                        index: row + col,
                        ...piece
                    })
                })
            })

            return {
                pieces,
                columns,
                rows,
                style
            }
        }

        return this.state.board
    }

    /**
     * Generate the HTML to be mounted in DOM
     *
     * @returns HTML Generators
     */
    render() {
        const {board: {rows, columns, pieces, style: {width, height}}, scale} = this.state

        return (
            div({className: 'game'},
                div({className: 'board', ref: "board"},
                    _.map(_.range(0, rows), (key, _i) => (
                            div({className: 'row', key, style: {height}},
                                _.map(_.range(0, columns), (key, i) => (
                                        div({className: `block ${(i + _i) % 2 === 0 ? 'dark' : ''}`, key, style: {width}})
                                    )
                                )
                            )
                        )
                    ),

                    _.map(pieces, ({top, left, id, type, index}) => (
                            Motion({
                                    defaultStyle: {
                                        left,
                                        top
                                    },
                                    style: {
                                        top: spring(top),
                                        left: spring(left)
                                    },
                                    key: id
                                },
                                ({left, top}) => (
                                    div({
                                        key: id,
                                        className: "piece",
                                        style: {
                                            left: `${left}px`,
                                            top: `${top}px`,
                                            width: width * scale,
                                            height: height * scale
                                        }
                                    }, Piece({type, dark: (index + 1) % 2 !== 0, scale, width, id}))
                                )
                            )
                        )
                    )
                )
            )
        )
    }
}
export default fact(Game)