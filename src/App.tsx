import React, { useEffect, useMemo } from 'react'
import SearchBar from './components/SearchBar'
import { Provider } from './hooks/useAppState'

function App() {
	return (
		<Provider>
			<header>
				<h1>Is it worth watching?</h1>
			</header>
			<SearchBar />
		</Provider>
	)
}

export default App
