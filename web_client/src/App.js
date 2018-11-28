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

const WS_URL = 'ws://localhost:8000'

class App extends Component {
  state = {}

  ws = new WebSocket(WS_URL)

  tags = ['emg', 'mov']

  componentDidMount() {
    this.ws.onopen = () => {
      console.log('connected')
    }

    this.ws.onmessage = evt => {
      // on receiving a message, add it to the list of messages
      try {
        const msg = JSON.parse(evt.data)
        msg.tag &&
          this.tags.includes(msg.tag) &&
          this.setState(() => ({
            [msg.tag || 'data']: {
              x: new Date(),
              y: msg.y,
            },
          }))
      } catch (e) {
        console.log(e)
      }
    }

    this.ws.onclose = () => {
      console.log('disconnected')
      // automatically try to reconnect on connection loss
      this.setState({ ws: new WebSocket(WS_URL) })
    }
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <SimpleAppBar />
        <Chart min={400} max={500} windowSize={500} title="EMG" data={this.state.emg || {}} />
        <Chart min={-15} max={15} windowSize={500} title="MOVIMENTO" data={this.state.mov || {}} />
      </MuiThemeProvider>
    )
  }
}

export default App
