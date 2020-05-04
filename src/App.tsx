import React from 'react'
import { Provider } from './hooks/useAppState'
import SearchBar from './components/SearchBar'
import Graph from './components/graph'

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
