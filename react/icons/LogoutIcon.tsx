import React, { Component } from 'react'

class GithubIcon extends Component {
  public render() {
    return (
      <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="15" height="14" fill="black" fillOpacity="0" transform="translate(1 1)"/>
        <path d="M6 8H16" stroke="#134CD8" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 4L16 8L12 12" stroke="#134CD8" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 15H2C1.448 15 1 14.552 1 14V2C1 1.448 1.448 1 2 1H9" stroke="#134CD8" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>

    )
  }
}

export default GithubIcon