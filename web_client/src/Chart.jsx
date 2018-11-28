import React from 'react'
import Plot from 'react-plotly.js'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'

const PaperStyle = {
  margin: '50px',
  padding: '20px 40px',
}

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

  componentWillReceiveProps(nextProps) {
    this.setState(prevState => ({
      ...prevState,
      windowDataX: [...prevState.windowDataX, nextProps.data.x],
      windowDataY: [...prevState.windowDataY, nextProps.data.y],
      newData: 1,
    }))
  }

  componentDidMount() {
    setInterval(() => this.state.newData && this.addDataToPlot(), this.props.windowSize)
  }

  addDataToPlot = () => {
    this.setState(() => ({
      windowDataX: [],
      windowDataY: [],
      newData: 0,
      data: {
        x: [].concat(
          this.state.data.x.length > this.props.windowSize
            ? this.state.data.x.filter((_, index) => index > this.state.windowDataX.length)
            : this.state.data.x,
          this.state.windowDataX,
        ),
        y: [].concat(
          this.state.data.y.length > this.props.windowSize
            ? this.state.data.y.filter((_, index) => index > this.state.windowDataX.length)
            : this.state.data.y,
          this.state.windowDataY,
        ),
      },
    }))
  }
  render() {
    return (
      <Paper style={PaperStyle}>
        <Typography variant="h6" style={{ paddingBottom: 5 }} color="textSecondary">
          {this.props.title}
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
            autosize: (this.props.min && this.props.max) || true,
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
