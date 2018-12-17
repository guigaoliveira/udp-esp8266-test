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
    const isNewData =
      !this.state.newData &&
      nextProps.data.x &&
      nextProps.data.x.length &&
      nextProps.data.y &&
      nextProps.data.y.length

    if (isNewData) {
      this.setState(prevState => ({
        ...prevState,
        windowDataX: [].concat(prevState.windowDataX, nextProps.data.x),
        windowDataY: [].concat(prevState.windowDataY, nextProps.data.y),
        newData: 1,
      }))
    }
  }

  shouldComponentUpdate() {
    return !!this.state.newData && this.addDataToPlot()
  }

  addDataToPlot = () => {
    const winLenght = this.state.windowDataY.length
    this.setState(() => ({
      windowDataX: [],
      windowDataY: [],
      newData: 0,
      data: {
        x: [].concat(
          this.state.data.x.length > this.props.windowSize
            ? this.state.data.x.filter((_, index) => index > winLenght)
            : this.state.data.x,
          this.state.windowDataX,
        ),
        y: [].concat(
          this.state.data.y.length > this.props.windowSize
            ? this.state.data.y.filter((_, index) => index > winLenght)
            : this.state.data.y,
          this.state.windowDataY,
        ),
      },
    }))
    return true
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
              type: 'scattergl',
              mode: 'markers',
            },
          ]}
          config={{ displayModeBar: false, displaylogo: false }}
          layout={{
            yaxis: {
              fixedrange: true,
              range: [this.props.min, this.props.max],
            },
            xaxis: { fixedrange: true },
            autosize: (this.props.min && this.props.max) || true,
            margin: { l: 40, r: 40, b: 40, t: 40, pad: 2 },
          }}
          style={{ width: '100%', height: 300 }}
          useResizeHandler={true}
        />
      </Paper>
    )
  }
}

export default React.memo(Chart)
