import React from 'react'
import RootView from './src/views/Root'
import RootStateInitializer, { INITIAL_STATE } from './src/model/RootState'
import * as TrafficApi from './src/model/TrafficApi'
//import * as TrafficApi from './test/MockTrafficApi'
import ActionContext from './src/ActionContext'

const { RootState, SelectedCamera } = RootStateInitializer(TrafficApi)

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = INITIAL_STATE
  }
  render() {
    return <ActionContext.Provider value={{ SelectedCamera }}>
      <RootView style={{ flex: 1 }} appState={this.state} />
    </ActionContext.Provider>
  }
  componentDidMount() {
    RootState.subscribe(this.setState.bind(this))
  }
}