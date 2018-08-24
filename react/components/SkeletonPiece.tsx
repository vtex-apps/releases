import React, { Component } from 'react'

interface SkeletonPieceProps {
  width?: number
}

const DEFAULT_WIDTH = 100

class SkeletonPiece extends Component<SkeletonPieceProps> {

  public render() {
    const width = this.props.width ? this.props.width : DEFAULT_WIDTH

    return (
      <div className={`pa5 bg-light-gray w-${width} relative overflow-hidden self-end mb3`}>
        <div className={`shimmer`} />
      </div>
    )
  }

}

export default SkeletonPiece