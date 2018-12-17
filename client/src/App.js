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
          this.tags.indexOf(msg.tag) !== -1 &&
          msg.x &&
          msg.y &&
          this.setState(() => ({
            [msg.tag]: {
              x: msg.x.map(item => new Date(item)),
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
        <Chart windowSize={500} title="EMG" data={this.state.emg || {}} />
        <Chart windowSize={500} title="MOVIMENTO" data={this.state.mov || {}} />
      </MuiThemeProvider>
    )
  }
}

export default React.memo(App)
