import '@/App.css'
import { speechSynthesisInWindow } from '@/utils/compatibilityNavigator'
import Compatibility from '@/components/Compatibility/Compatibility'
import { FormFile } from '@/components/FormFile/FormFile'
import TextOutput from '@/components/TextOutput/TextOutput'
import { Toast } from '@/components/Toast/Toast'

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
      <Toast />
      {speechSynthesisInWindow() === 'Android no Edge' && (
        <section className="section-advice">
          <Compatibility />
        </section>
      )}
      <FormFile />
      <section className="section-textOutput">
        <TextOutput />
      </section>
    </main>
  )
}
export default App
