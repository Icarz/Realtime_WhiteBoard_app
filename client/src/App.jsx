import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WhiteboardProvider } from '@context/WhiteboardContext';
import { AuthProvider } from '@context/AuthContext';
import Home from '@pages/Home';
import WhiteboardRoom from '@pages/WhiteboardRoom';
import NotFound from '@pages/NotFound';
import ErrorBoundary from '@components/Common/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <SocketProvider>
            <WhiteboardProvider>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/room/:roomId" element={<WhiteboardRoom />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </WhiteboardProvider>
          </SocketProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;