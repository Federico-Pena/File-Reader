import '@/App.css'
import { speechSynthesisInWindow } from '@/utils/compatibilityNavigator'
import Compatibility from '@/components/Compatibility/Compatibility'
import { FormFile } from './components/FormFile/FormFile'
import TextOutput from './components/TextOutput/TextOutput'

function App() {
  const navegador = speechSynthesisInWindow()

  if (navegador === 'PC Firefox') {
    return (
      <main className="mainApp">
        <section className="section-advice">
          <Compatibility />
        </section>
      </main>
    )
  }

  return (
    <main className="mainApp">
      {speechSynthesisInWindow() === 'Android no Edge' && (
        <section className="section-advice">
          <Compatibility />
        </section>
      )}
      <section className="section-formFile">
        <FormFile />
      </section>
      <section className="section-textOutput">
        <TextOutput />
      </section>
    </main>
  )
}
export default App
