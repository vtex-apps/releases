import { ApolloClient } from 'apollo-client'
import moment from 'moment'
import { addIndex, map } from 'ramda'
import React, { Component } from 'react'
import { compose, graphql, withApollo } from 'react-apollo'
import { Spinner } from 'vtex.styleguide'

import ReleaseNoteCard from './ReleaseNoteCard'
import ReleaseTime from './ReleaseTime'

import ReleasesNotes from '../queries/ReleasesNotes.graphql'

interface ReleasesNotesData {
  releasesNotes: any
}

interface ReleasesNotesProps {
  client: ApolloClient<any>
  releasesNotes: any
}

interface ReleasesNotesState {
  isLoading: boolean
  lastPage: boolean
  nextPage: number
  releasesNotes: ReleaseNote[]
}

const mapNotesWithIndex = addIndex<ReleaseNote>(map)

class ReleasesNotesList extends Component<ReleasesNotesProps, ReleasesNotesState> {
  constructor(props: any) {
    super(props)

    this.state = {
      isLoading: props.releasesNotes.loading,
      lastPage: false,
      nextPage: 2,
      releasesNotes: props.releasesNotes.releasesNotes
    }
  }

  public componentDidUpdate(prevProps: ReleasesNotesProps, _: ReleasesNotesState) {
    const { releasesNotes: { loading: prevLoading } } = prevProps
    const { releasesNotes: curStateNotes } = this.state
    const { releasesNotes: { releasesNotes: curPropsNotes, loading: curLoading } } = this.props

    if (prevLoading && !curLoading && !curStateNotes) {
      this.setState((prevState) => {
        return ({
          ...prevState,
          isLoading: false,
          releasesNotes: curPropsNotes
        })
      })
    }
  }

  public render() {
    const { isLoading, releasesNotes } = this.state
    const { releasesNotes: { error } } = this.props

    if (error) {
      console.error(error)
    }

    const notesList = releasesNotes
      ? mapNotesWithIndex((note: ReleaseNote, index: number) => {
        const noteDate = moment(new Date(note.date))

        const lastNote = index !== 0
          ? moment(new Date(releasesNotes[index - 1].date))
          : null

        const addDate =
          index === 0 ||
          lastNote !== null &&
          noteDate.date() !== lastNote.date()

        return (
          <div key={note.cacheId} className="flex flex-row w-100 justify-center mb8">
            <ReleaseTime
              canAddDate={addDate}
              releaseDate={noteDate}
            />
            <ReleaseNoteCard note={note} />
          </div>
        )
      }, releasesNotes)
      : []

    return (
      <div
        className="pa5 ph8-ns pv4-ns flex-auto overflow-y-scroll"
        onScroll={this.onScroll}
      >
        {notesList}
        {isLoading ? this.renderLoading() : null}
      </div>
    )
  }

  private getPage = (page: number) => {
    const { client } = this.props

    client.query<ReleasesNotesData>({
      query: ReleasesNotes,
      variables: { page }
    }).then((data) => {
      const releasesNotes = data.data.releasesNotes

      this.setState((prevState) => {
        return ({
          ...prevState,
          isLoading: false,
          lastPage: releasesNotes.length === 0,
          releasesNotes: [...prevState.releasesNotes, ...releasesNotes]
        })
      })
    })
  }

  private onScroll = (event: any) => {
    const { isLoading, lastPage } = this.state
    const element = event.target
    const bottom = element.scrollHeight - element.scrollTop === element.clientHeight

    if (bottom && !isLoading && !lastPage) {
      this.setState((prevState) => {
        this.getPage(prevState.nextPage)

        return { isLoading: true, nextPage: prevState.nextPage + 1 }
      })
    }
  }

  private renderLoading = () => {
    return (
      <div className="w-100 flex justify-center pv4">
        <Spinner />
      </div>
    )
  }
}

export default compose(
  withApollo,
  graphql<ReleasesNotesData>(ReleasesNotes, { name: 'releasesNotes' })
)(ReleasesNotesList)