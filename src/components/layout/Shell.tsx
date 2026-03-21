import { Sidebar } from './Sidebar'
import { MainPanel } from './MainPanel'

export function Shell() {
  return (
    <div className="shell">
      <Sidebar />
      <MainPanel />
    </div>
  )
}
