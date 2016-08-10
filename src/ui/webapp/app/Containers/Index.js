import { Component, createFactory, PropTypes } from 'react'
import { div } from 'app/components'
import _ from 'lodash'

import { Motion as motion, spring } from 'react-motion'
const Motion = createFactory(motion)

export default
createFactory(class Index extends Component {

    constructor() {
        super()

        this.state = {

            rows: 1,
            columns: 1,
            pieces: null,
            style: {},

            scale: .6
        }
    }

    componentDidMount() {
        this.getBoard()

        setTimeout(() => {
            this.getBoard(true)
        }, 1000)
    }

    getBoard(c) {
        if (window.java) {
            const board = java.getBoard()

            this.setState({
                ...this.parseBoard(
                    board.formatAsString(),
                    board.getX(),
                    board.getY()
                )
            })
        } else {
            const col = 4, row = 4
            let board = "n-n-n-n|1=1:1-n-n-n|n-n-n-n|2=2:2-n-n-n"
            if (c) {
                board = "n-n-n-n|1=1:1-n-n-n|n-n-n-n|n-2=2:2-n-n"
            }

            this.setState({
                ...this.parseBoard(board, col, row)
            })
        }
    }

    parseBoard = (board, rows, columns) => {
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

            _.forEach((board + "").split("|"), (block, index) => {
                block = _.map((block + "").split("-"), (item, _i) => {
                    if (item == "n") {
                        return {
                            dimensions: null
                        }
                    }

                    const _item = (item + "").split("=")
                    const dimensions = (_item[1] + "").split(":")

                    return {
                        id: _item[0],
                        dimensions: _item[1],
                        dX: dimensions[0],
                        dY: dimensions[1],
                        p: dimensions[2] || false
                    }
                })

                const row = Math.floor(index / columns)
                const col = (index % columns)

                _.forEach(block, piece => {
                    if (piece.dimensions !== null) {
                        pieces.push({
                            left: (row * style.height) + topCenter + (style.height * _scale),
                            top: ((col - 1) * style.width) + leftCenter + (style.width * _scale),
                            index: row + col,
                            ...piece
                        })
                    }
                })
            })

            return {
                pieces,
                columns,
                rows,
                style
            }
        }
    }

    render() {
        const {rows, columns, pieces, style: {width, height}, scale} = this.state

        return (
            div({className: "container"},
                div({className: "board", ref: "board"},
                    _.map(_.range(0, rows), (key, _i) => (
                            div({className: 'row', key, style: {height}},
                                _.map(_.range(0, columns), (key, i) => (
                                        div({className: `block ${(i + _i) % 2 === 0 ? 'dark' : ''}`, key, style: {width}})
                                    )
                                )
                            )
                        )
                    ),

                    _.map(pieces, ({top, left, id, dX, dY, index, p}) => (
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
                                            background: p ? "yellow" : "green",
                                            left: `${left}px`,
                                            top: `${top - (height * scale)}px`,
                                            width: width * scale + (height * scale),
                                            height: height * scale + (height * scale)
                                        }
                                    }, p ? "player" : "")
                                )
                            )
                        )
                    )
                )
            )
        )
    }
})