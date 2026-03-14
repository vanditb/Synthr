import React, { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Builder } from './pages/Builder';
import { Preview } from './pages/Preview';
import { BusinessDetails } from './types';

function App() {
  const [businessDetails, setBusinessDetails] = useState<BusinessDetails | null>(null);

  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/create" element={<Builder setDetails={setBusinessDetails} />} />
          <Route path="/preview" element={<Preview details={businessDetails} />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;