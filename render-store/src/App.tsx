import "./index.css";
import { IsValidStorefront } from './isValidStorefront.tsx';
import { StorefrontProviders } from './StorefrontProviders.tsx';

function App() {
  return (
    <StorefrontProviders>
      <IsValidStorefront />
    </StorefrontProviders>
  );
}

export default App;
