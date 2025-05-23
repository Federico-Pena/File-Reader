import '@/App.css'
import Compatibility from '@/components/Compatibility/Compatibility'
import { FormFile } from '@/components/FormFile/FormFile'
import TextOutput from '@/components/TextOutput/TextOutput'
import { Toast } from '@/components/Toast/Toast'

function App() {
  return (
    <main className="mainApp">
      <Toast />
      <FormFile />
      <section className="section-textOutput">
        <Compatibility />
        <TextOutput />
      </section>
    </main>
  )
}
export default App
