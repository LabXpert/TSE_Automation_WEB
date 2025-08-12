import { BrowserRouter } from 'react-router-dom';
import Rotalar from './routes/Rotalar';
import './styles/App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Rotalar />
      </div>
    </BrowserRouter>
  );
}

export default App;