import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Input, Button, useToast, Box, FormControl, FormLabel, Select, VStack, Heading } from '@chakra-ui/react';

const KampanyaEkle = ({ firmalar, onAdd }) => {
  const [kampanyaBasligi, setKampanyaBasligi] = useState('');
  const [bitisTarihi, setBitisTarihi] = useState('');
  const [firmaId, setFirmaId] = useState('');
  const toast = useToast();

  const addKampanya = async () => {
    if (!kampanyaBasligi || !bitisTarihi || !firmaId) {
      toast({
        title: 'Hata',
        description: 'Tüm alanlar doldurulmalıdır.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const { error } = await supabase.from('Kampanyalar').insert([{
      kampanya_basligi: kampanyaBasligi,
      bitis_tarihi: bitisTarihi,
      firma_id: firmaId,
    }]);

    if (error) {
      console.error('Kampanya ekleme hatası:', error.message);
      toast({
        title: 'Hata',
        description: 'Kampanya eklenirken bir hata oluştu.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } else {
      setKampanyaBasligi('');
      setBitisTarihi('');
      setFirmaId('');
      toast({
        title: 'Başarı',
        description: 'Kampanya başarıyla eklendi.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      onAdd(); // Kampanya eklendiğinde listeyi yenile
    }
  };

  return (
    <Box p={4} maxW="xxl" mx="auto" borderWidth={1} borderRadius="lg" boxShadow="md">
      <Heading as="h2" size="lg" mb={4} textAlign="center">Yeni Kampanya Ekle</Heading>
      <VStack spacing={4} align="stretch">
        <FormControl id="kampanyaBasligi">
          <FormLabel>Kampanya Başlığı</FormLabel>
          <Input
            value={kampanyaBasligi}
            onChange={(e) => setKampanyaBasligi(e.target.value)}
          />
        </FormControl>
        <FormControl id="bitisTarihi">
          <FormLabel>Bitiş Tarihi</FormLabel>
          <Input
            type="date"
            value={bitisTarihi}
            onChange={(e) => setBitisTarihi(e.target.value)}
          />
        </FormControl>
        <FormControl id="firmaId">
          <FormLabel>Firma</FormLabel>
          <Select
            value={firmaId}
            onChange={(e) => setFirmaId(e.target.value)}
          >
            <option value="">Firma Seçiniz</option>
            {firmalar.map(firma => (
              <option key={firma.id} value={firma.id}>{firma.firma_adi}</option>
            ))}
          </Select>
        </FormControl>
        <Button maxW={200} mx="auto" onClick={addKampanya} colorScheme="teal">
          Ekle
        </Button>
      </VStack>
    </Box>
  );
};

export default KampanyaEkle;
