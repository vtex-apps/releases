import React, { Component } from 'react'
import { Tab, Tabs } from 'vtex.styleguide'
import { injectIntl } from 'react-intl';

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
            id: 'releases.content.overview',
          })}
          active={contentType === 'overview'}
          onClick={() => handleContentChange('overview')}
        />
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
        <Tab
          label={intl.formatMessage({
            id: 'releases.content.apps',
          })}
          active={contentType === 'apps'}
          onClick={() => handleContentChange('apps')}
        />
      </Tabs>
    )
  }
}

export default injectIntl(NavigationTab)