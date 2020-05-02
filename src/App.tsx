import React, { useEffect, useMemo } from 'react'
import SearchBar from './components/SearchBar'
import { Provider } from './hooks/useAppState'

function App() {
	return (
		<Provider>
			<SearchBar />
		</Provider>
	)
}

export default App
