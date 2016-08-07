import { render } from 'react-dom'
import { div, el } from 'app/components'
if (env.ENVIRONMENT == 'development') {
    require('./app.scss')
}

import Container from 'app/containers/Container'

console.debug("JavaScript loaded.")

/**
 * Catch errors a log them into the Java console
 * 
 * @param e
 */
window.onerror = e => {
    console.error(e)
}

/**
 * Wait until all resources have loaded and then render the React app into the #root of the index.html
 */
window.onload = () => {
    render(Container(), document.getElementById('root'))
    console.debug("React rendered.")
}