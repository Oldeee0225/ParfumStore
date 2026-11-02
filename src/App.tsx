import './App.css'
import { AppProviders } from '@/providers/AppProviders'
import { AppRouter } from '@/app/router'

export default function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  )
}
