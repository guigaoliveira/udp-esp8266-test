import React from 'react'
import Plot from 'react-plotly.js'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'

const PaperStyle = {
  margin: '50px',
  padding: '20px 40px',
}

const WS_URL = 'ws://localhost:8000'

const addAxisData = (dataAxis, windowData, windowSize) =>
  [].concat(
    dataAxis.length > windowSize
      ? dataAxis.filter((_, index) => index > windowData.length)
      : dataAxis,
    windowData,
  )
class Chart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {
        x: [],
        y: [],
      },
      windowDataY: [],
      windowDataX: [],
      newData: 0,
    }
  }

  ws = new WebSocket(WS_URL)

  componentDidMount() {
    setInterval(() => this.state.newData && this.addDataToPlot(), this.props.windowSize)
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
        x: addAxisData(prevState.data.x, prevState.windowDataY, this.props.windowSize),
        y: addAxisData(prevState.data.y, prevState.windowDataY, this.props.windowSize),
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
              type: 'scatter',
            },
          ]}
          config={{
            displayModeBar: false,
            displaylogo: false,
          }}
          layout={{
            yaxis: {
              fixedrange: true,
              range: [this.props.min, this.props.max],
            },
            xaxis: {
              fixedrange: true,
            },
            // autosize: true,
            margin: {
              l: 40,
              r: 40,
              b: 40,
              t: 40,
              pad: 2,
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
