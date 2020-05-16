import React from 'react'
import { Provider } from './hooks/useAppState'
import SearchBar from './components/SearchBar'
import Graph from './components/chart/wrapper'

function App() {
	return (
		<Provider>
			<SearchBar />
			<Graph />
		</Provider>
	)
}

export default App
