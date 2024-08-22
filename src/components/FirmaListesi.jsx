import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, IconButton, useToast, Text, Button } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

const FirmaListesi = () => {
  const [firmalar, setFirmalar] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const toast = useToast();

  const fetchFirmalar = async (pageNumber = 1) => {
    setLoading(true);
    const { data, error, count } = await supabase
      .from('Firmalar')
      .select('*', { count: 'exact' })
      .range((pageNumber - 1) * 3, pageNumber * 3 - 1);

    if (error) {
      console.error('Firmalar çekme hatası:', error.message);
      setError('Firmalar yüklenirken bir hata oluştu.');
    } else {
      setFirmalar(data);
      setTotalPages(Math.ceil(count / 3));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFirmalar(page);
  }, [page]);

  const handleDelete = async (id) => {
    const { error } = await supabase.from('Firmalar').delete().eq('id', id);
    if (error) {
      console.error('Firma silme hatası:', error.message);
      toast({
        title: 'Hata',
        description: 'Firma silinirken bir hata oluştu.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } else {
      fetchFirmalar(page);
      toast({
        title: 'Başarı',
        description: 'Firma başarıyla silindi.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4} maxW="xxl" mx="auto" borderWidth={1} borderRadius="lg" boxShadow="md">
      <Heading as="h2" size="lg" mb={4} textAlign="center">Firma Listesi</Heading>
      {error && <Text color="red.500" mb={4}>{error}</Text>}
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Firma Adı</Th>
            <Th>Sil</Th>
          </Tr>
        </Thead>
        <Tbody>
          {firmalar.length > 0 ? (
            firmalar.map(firma => (
              <Tr key={firma.id}>
                <Td>{firma.firma_adi}</Td>
                <Td>
                  <IconButton
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    aria-label="Sil"
                    onClick={() => handleDelete(firma.id)}
                  />
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan="3">Hiç firma bulunamadı.</Td>
            </Tr>
          )}
        </Tbody>
      </Table>
      <Box mt={4} textAlign="center">
        <Button
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          disabled={page === 1}
          mr={2}
        >
          Önceki
        </Button>
        <Button
          onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          Sonraki
        </Button>
      </Box>
    </Box>
  );
};

export default FirmaListesi;
