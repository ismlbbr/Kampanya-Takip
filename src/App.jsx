import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Box, Flex, VStack, Text } from '@chakra-ui/react';
import FirmaEkle from './components/FirmaEkle';
import Firmalar from './components/FirmaListesi';
import KampanyaEkle from './components/KampanyaEkle';
import Kampanyalar from './components/KampanyaListesi';
import { supabase } from './supabaseClient';

const Sidebar = () => {
  return (
    <Box as="nav" width="250px" bg="gray.800" color="white" minHeight="100vh" p={4}>
      <VStack align="start" spacing={4}>
        <Text fontSize="2xl" fontWeight="bold">Menü</Text>
        <Link to="/firma-ekle">
          <Text _hover={{ color: 'teal.400' }}>Firma Ekle</Text>
        </Link>
        <Link to="/firmalar">
          <Text _hover={{ color: 'teal.400' }}>Firmalar</Text>
        </Link>
        <Link to="/kampanya-ekle">
          <Text _hover={{ color: 'teal.400' }}>Kampanya Ekle</Text>
        </Link>
        <Link to="/kampanyalar">
          <Text _hover={{ color: 'teal.400' }}>Kampanyalar</Text>
        </Link>
      </VStack>
    </Box>
  );
};

const App = () => {
  const [firmalar, setFirmalar] = useState([]);

  useEffect(() => {
    const fetchFirmalar = async () => {
      const { data, error } = await supabase.from('Firmalar').select('*');
      if (error) {
        console.error('Firma verilerini yüklerken hata:', error.message);
      } else {
        setFirmalar(data);
      }
    };

    fetchFirmalar();
  }, []);

  return (
    <Router>
      <Flex>
        <Sidebar />
        <Box flex="1" p={4}>
          <Routes>
            <Route path="/firma-ekle" element={<FirmaEkle />} />
            <Route path="/firmalar" element={<Firmalar />} />
            <Route path="/kampanya-ekle" element={<KampanyaEkle firmalar={firmalar} />} />
            <Route path="/kampanyalar" element={<Kampanyalar />} />
          </Routes>
        </Box>
      </Flex>
    </Router>
  );
};

export default App;
