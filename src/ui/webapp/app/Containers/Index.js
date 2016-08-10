import { Component, createFactory, PropTypes } from 'react'
import { div } from 'app/components'

export default
createFactory(class Index extends Component {

    constructor() {
        super()

        this.state = {}
    }

    render() {
        return (
            div()
        )
    }
})