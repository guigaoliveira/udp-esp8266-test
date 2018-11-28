import React, { Component } from 'react'
import SimpleAppBar from './SimpleAppBar'
import Chart from './Chart'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import red from '@material-ui/core/colors/red'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: red[600],
    },
    secondary: {
      main: red[900],
    },
  },
})

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <SimpleAppBar />
        <Chart />
      </MuiThemeProvider>
    )
  }
}

export default App
