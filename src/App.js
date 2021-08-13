import React from 'react';
import Routes from './routes';
import ClearCache from "react-clear-cache";

import "./_scss/app.scss";

const App = () => {
	return (
    <div>
      <ClearCache>
        {({ isLatestVersion, emptyCacheStorage }) => (
          <div>
            {!isLatestVersion && (
              <p>
                <button
                  onClick={e => {
                    e.preventDefault();
                    emptyCacheStorage();
                  }}
                >
                  Update version
                </button>
              </p>
            )}

						{isLatestVersion && (
							<Routes />
						)}
          </div>
        )}
      </ClearCache>
    </div>
  );
}

export default App;