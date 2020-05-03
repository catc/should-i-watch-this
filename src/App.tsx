import React from 'react'
import SearchBar from './components/SearchBar'
import { Provider } from './hooks/useAppState'
import Graph from './components/Graph'

function App() {
	return (
		<Provider>
			<header>
				<h1>Is it worth watching?</h1>
			</header>
			<SearchBar />
			<Graph />
		</Provider>
	)
}

export default App
