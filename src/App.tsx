import { AppProvider, useApp } from './context/AppContext'
import { ThemeProvider } from './context/ThemeContext'
import { Shell } from './components/layout/Shell'
import { UserPicker } from './components/accounts/UserPicker'

function AppInner() {
  const { activeUserId, loading } = useApp()

  if (loading) {
    return (
      <div className="app-loading">
        <div className="app-loading-spinner" />
      </div>
    )
  }

  if (!activeUserId) {
    return <UserPicker />
  }

  return <Shell />
}

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AppInner />
      </AppProvider>
    </ThemeProvider>
  )
}

export default App
