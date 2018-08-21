import React, { Component } from 'react'

interface BadgeProps {
  className?: string
}

class Badge extends Component<BadgeProps> {
  public render() {
    const { className } = this.props

    return (
      <div className={`${className} br-pill f6 pv2 ph3 dib fw5`}>
        {this.props.children}
      </div>
    )
  }
}

export default Badge