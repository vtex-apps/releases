import { ApolloClient, ApolloQueryResult } from 'apollo-client'
import { addIndex, map } from 'ramda'
import React, { Component } from 'react'
import moment from 'moment'
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

const mapWithIndex = addIndex(map)

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

  public componentDidUpdate(prevProps: ReleasesNotesProps, _) {
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

  public getPage = (page: number) => {
    const { client } = this.props

    client.query({
      query: ReleasesNotes,
      variables: { page }
    }).then((data: ApolloQueryResult<ReleasesNotesData>) => {
      const releasesNotes = data.data.releasesNotes
      console.log(data)
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

  public onScroll = (event: any) => {
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

  public renderLoading = () => {
    return (
      <div className="w-100 flex justify-center bg-light-silver pt4">
        <Spinner />
      </div>
    )
  }

  public render() {
    const { isLoading, releasesNotes } = this.state
    const { releasesNotes: { error } } = this.props  
    
    if (error) {
      console.error(error)
    }
    console.log(releasesNotes)
    const notesList = releasesNotes
      ? mapWithIndex((note: ReleaseNote, index: number) => {
        const noteDate = moment(new Date(note.date))

        const lastNote = index !== 0
          ? moment(new Date(releasesNotes[index - 1].date))
          : null

        const addDate =
          index === 0 ||
          noteDate.date() !== lastNote.date()
        
        return (
          <div key={note.cacheId} className="flex flex-row w-100 pl9 pt8 justify-center">
            <div className="flex flex-column h-100 w5 mr7 pr7">
              <ReleaseTime
                canAddDate={addDate}
                releaseDate={noteDate}
              />
            </div>
            <ReleaseNoteCard note={note} />
          </div>
        )
      }, releasesNotes)
      : []
    console.log(notesList)
    return (
      <div
        className="releases-content w-100 flex flex-row flex-wrap items-center bg-light-silver pv4 overflow-y-scroll overflow-x-hidden"
        onScroll={this.onScroll}
      >
        {notesList}
        {isLoading ? this.renderLoading() : null}
      </div>
    )
  }
}

export default compose(
  withApollo,
  graphql<ReleasesNotesData>(ReleasesNotes, { name: 'releasesNotes' })
)(ReleasesNotesList)