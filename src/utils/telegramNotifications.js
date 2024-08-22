// utils/telegramNotifications.js
export const sendTelegramNotification = async (chatId, message) => {
    const token = '7200002113:AAE97Cy5g6yjL7ex58kLdNjuEMrZakOQWzA';  // Bot token'ınızı buraya yapıştırın
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
      });
  
      const data = await response.json();
      if (data.ok) {
        console.log('Mesaj başarıyla gönderildi:', data);
      } else {
        console.error('Mesaj gönderilirken bir hata oluştu:', data);
      }
    } catch (error) {
      console.error('Telegram API hatası:', error);
    }
  };
  