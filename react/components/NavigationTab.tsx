import React, { Component } from 'react'
import { injectIntl } from 'react-intl'
import { Tab, Tabs } from 'vtex.styleguide'

interface Props {
  contentType: string
  handleContentChange: (contentType: string) => void
}

class NavigationTab extends Component<Props & ReactIntl.InjectedIntlProps> {

  public render() {
    const { contentType, handleContentChange, intl } = this.props

    return (
      <Tabs>
        <Tab
          label={intl.formatMessage({
            id: 'releases.content.releases',
          })}
          active={contentType === 'releases'}
          onClick={() => handleContentChange('releases')}
        />
        <Tab
          label={intl.formatMessage({
            id: 'releases.content.notes',
          })}
          active={contentType === 'notes'}
          onClick={() => handleContentChange('notes')}
        />
      </Tabs>
    )
  }
}

export default injectIntl(NavigationTab)