import React from 'react'
import { Provider } from './hooks/useAppState'
import SearchBar from './components/SearchBar'
import ChartWrapper from './components/ChartWrapper'

function App() {
	return (
		<Provider>
			<SearchBar />
			<ChartWrapper />
		</Provider>
	)
}

export default App
