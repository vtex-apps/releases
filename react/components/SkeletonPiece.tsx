import React, { Component } from 'react'

interface SkeletonPieceProps {
  color?: string
  height?: number
  width?: number
}

const DEFAULT_COLOR = 'light-gray'
const DEFAULT_HEIGHT = 4
const DEFAULT_WIDTH = 4

class SkeletonPiece extends Component<SkeletonPieceProps> {

  public render() {
    const color = this.props.color ? this.props.color : DEFAULT_COLOR
    const height = this.props.height ? this.props.height : DEFAULT_HEIGHT
    const width = this.props.width ? this.props.width : DEFAULT_WIDTH

    return (
      <div className={`pa${height} bg-${color} w${width} relative overflow-hidden self-end mb3`}>
        <div className={`shimmer`} />
      </div>
    )
  }

}

export default SkeletonPiece