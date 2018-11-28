import React from 'react'
import Plot from 'react-plotly.js'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'

const PaperStyle = {
  margin: '50px',
  padding: '20px 40px',
}

const WS_URL = 'ws://localhost:8000'
const WINDOW_SIZE = 500

class Chart extends React.Component {
  state = {
    data: {
      x: [],
      y: [],
    },
    windowDataY: [],
    windowDataX: [],
    newData: 0,
  }

  ws = new WebSocket(WS_URL)

  componentDidMount() {
    setInterval(() => this.state.newData && this.addDataToPlot(), WINDOW_SIZE)
    this.ws.onopen = () => {
      console.log('connected')
    }

    this.ws.onmessage = evt => {
      // on receiving a message, add it to the list of messages
      try {
        this.setState(prevState => ({
          ...prevState,
          windowDataX: [...prevState.windowDataX, new Date()],
          windowDataY: [...prevState.windowDataY, JSON.parse(evt.data).y],
          newData: 1,
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

  addDataToPlot = () =>
    this.setState(prevState => ({
      windowDataX: [],
      windowDataY: [],
      newData: 0,
      data: {
        x: [].concat(
          prevState.data.x.length > WINDOW_SIZE
            ? prevState.data.x.filter((_, index) => index > prevState.windowDataX.length)
            : prevState.data.x,
          prevState.windowDataX,
        ),
        y: [].concat(
          prevState.data.y.length > WINDOW_SIZE
            ? prevState.data.y.filter((_, index) => index > prevState.windowDataX.length)
            : prevState.data.y,
          prevState.windowDataY,
        ),
      },
    }))

  render() {
    return (
      <Paper style={PaperStyle}>
        <Typography variant="h6" style={{ paddingBottom: 5 }} color="textSecondary">
          Signal
        </Typography>
        <Plot
          data={[
            {
              ...this.state.data,
              type: 'scattergl',
            },
          ]}
          config={{
            displayModeBar: false,
            displaylogo: false,
          }}
          layout={{
            yaxis: {
              fixedrange: true,
            },
            xaxis: {
              fixedrange: true,
            },
            autosize: true,
            margin: {
              l: 20,
              r: 20,
              b: 20,
              t: 20,
            },
          }}
          style={{ width: '100%', height: 300 }}
          useResizeHandler={true}
        />
      </Paper>
    )
  }
}

export default Chart
