
// import './App.css'
 import {TreePage} from './pages/TreePage';

function App() {
  return (
    <>
      <div className="App">
        <header className="App-header">
          <h1>Welcome to My React App</h1>
          <p>This is a simple React application.</p>
        </header>
        <main>
          <p>Feel free to explore and modify the code!</p>
          {/* <TreeStructure /> */}
          <TreePage />
        </main>
        <footer>
          <p>&copy; 2023 My React App</p>
        </footer>

      </div>
    </>
  )
}

export default App
