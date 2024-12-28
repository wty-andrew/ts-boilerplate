import { greet } from 'wasm-lib'

const App = () => <h1 className="text-3xl font-bold underline">{greet('World')}</h1>

export default App
