import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, IconButton, useToast, Text, Button } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { sendTelegramNotification } from '../utils/telegramNotifications';

const KampanyaListesi = () => {
  const [kampanyalar, setKampanyalar] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [firmalar, setFirmalar] = useState([]);
  const toast = useToast();

  const fetchFirmalar = async () => {
    const { data, error } = await supabase.from('Firmalar').select('*');
    if (error) {
      console.error('Firmalar çekme hatası:', error.message);
    } else {
      setFirmalar(data);
    }
  };

  const fetchKampanyalar = async (pageNumber = 1) => {
    setLoading(true);
    const { data, error, count } = await supabase
      .from('Kampanyalar')
      .select('*', { count: 'exact' })
      .range((pageNumber - 1) * 5, pageNumber * 5 - 1);
  
    if (error) {
      console.error('Kampanyalar çekme hatası:', error.message);
      setError('Kampanyalar yüklenirken bir hata oluştu.');
    } else {
      const sortedData = data.sort((a, b) => new Date(a.bitis_tarihi) - new Date(b.bitis_tarihi));
      setKampanyalar(sortedData);
      setTotalPages(Math.ceil(count / 5));
      checkKampanyaDurum(sortedData);
    }
    setLoading(false);
  };
  

  useEffect(() => {
    fetchFirmalar().then(() => fetchKampanyalar(page));
  }, [page]);

  useEffect(() => {
    if (firmalar.length > 0 && kampanyalar.length > 0) {
      checkKampanyaDurum(kampanyalar);
    }
  }, [firmalar, kampanyalar]);

  const handleDelete = async (id) => {
    const { error } = await supabase.from('Kampanyalar').delete().eq('id', id);
    if (error) {
      console.error('Kampanya silme hatası:', error.message);
      toast({
        title: 'Hata',
        description: 'Kampanya silinirken bir hata oluştu.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } else {
      fetchKampanyalar(page);
      toast({
        title: 'Başarı',
        description: 'Kampanya başarıyla silindi.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const checkKampanyaDurum = (kampanyalar) => {
    const chatId = '1129597963';  // Chat ID'nizi buraya yapıştırın
    const notificationThresholdDays = 2; // Bildirim gönderme eşiği (gün)
  
    kampanyalar.forEach(kampanya => {
      const today = new Date();
      const bitisTarihi = new Date(kampanya.bitis_tarihi);
      const differenceInDays = Math.ceil((bitisTarihi - today) / (1000 * 60 * 60 * 24));
  
      if (differenceInDays <= notificationThresholdDays && differenceInDays >= 0) {
        const firma = firmalar.find(firma => firma.id === kampanya.firma_id);
        const firmaAdi = firma ? firma.firma_adi : 'Bilinmiyor';
  
        const message = `Kampanya "${kampanya.kampanya_basligi}" (${firmaAdi}) bitiş tarihi ${bitisTarihi.toLocaleDateString()} yaklaşmakta!`;
  
        // Eğer aynı kampanya için bildirim daha önce gönderildiyse tekrar göndermeyin
        if (!kampanya.notified) {
          sendTelegramNotification(chatId, message);
  
          // Bildirim gönderildi olarak işaretleyin
          kampanya.notified = true;
        }
      }
    });
  };
  

  return (
    <Box p={4} maxW="xxl"  mx="auto" borderWidth={1} borderRadius="lg" boxShadow="md">
      <Heading as="h2" size="lg" mb={4} textAlign="center">Kampanya Listesi</Heading>
      {error && <Text color="red.500" mb={4}>{error}</Text>}
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Firma Adı</Th>
            <Th>Kampanya Başlığı</Th>
            <Th>Bitiş Tarihi</Th>
            <Th>Sil</Th>
          </Tr>
        </Thead>
        <Tbody>
          {kampanyalar.length > 0 ? (
            kampanyalar.map(kampanya => {
              const today = new Date();
              const bitisTarihi = new Date(kampanya.bitis_tarihi);
              const differenceInDays = Math.ceil((bitisTarihi - today) / (1000 * 60 * 60 * 24));
              const isApproaching = differenceInDays <= 2;

              return (
                <Tr
                  key={kampanya.id}
                  bg={isApproaching ? 'red.100' : 'white'}
                >
                  <Td>{firmalar.find(firma => firma.id === kampanya.firma_id)?.firma_adi || 'Bilinmiyor'}</Td>
                  <Td>{kampanya.kampanya_basligi}</Td>
                  <Td>{bitisTarihi.toLocaleDateString()}</Td>
                  <Td>
                    <IconButton
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      aria-label="Sil"
                      onClick={() => handleDelete(kampanya.id)}
                    />
                  </Td>
                </Tr>
              );
            })
          ) : (
            <Tr>
              <Td colSpan="4">Hiç kampanya bulunamadı.</Td>
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

export default KampanyaListesi;
