import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Input, Button, useToast, Box, FormControl, FormLabel, VStack, Heading } from '@chakra-ui/react';

const FirmaEkle = ({ onAdd }) => {
  const [firmaAdi, setFirmaAdi] = useState('');
  const toast = useToast();

  const addFirma = async () => {
    if (!firmaAdi) {
      toast({
        title: 'Hata',
        description: 'Firma adı boş bırakılamaz.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const { error } = await supabase.from('Firmalar').insert([{ firma_adi: firmaAdi }]);

    if (error) {
      console.error('Firma ekleme hatası:', error.message);
      toast({
        title: 'Hata',
        description: 'Firma eklenirken bir hata oluştu.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } else {
      setFirmaAdi('');
      toast({
        title: 'Başarı',
        description: 'Firma başarıyla eklendi.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      onAdd();  // Listeyi yenilemek için onAdd işlevini çağır
    }
  };

  return (
    <Box p={4} maxW="xxl" mx="auto" borderWidth={1} borderRadius="lg" boxShadow="md">
      <Heading as="h2" size="lg" mb={4} textAlign="center">Yeni Firma Ekle</Heading>
      <VStack spacing={4} align="stretch">
        <FormControl id="firmaAdi">
          <FormLabel>Firma Adı</FormLabel>
          <Input
            value={firmaAdi}
            onChange={(e) => setFirmaAdi(e.target.value)}
            placeholder="Firma adını girin"
            variant="outline"
          />
        </FormControl>
        <Button maxW={200} mx="auto" colorScheme="teal" onClick={addFirma} size="lg">
          Ekle
        </Button>
      </VStack>
    </Box>
  );
};

export default FirmaEkle;
