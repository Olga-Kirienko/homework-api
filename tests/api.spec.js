import { test, expect } from '@playwright/test';

test.describe('API-тесты для Restful-booker', () => {

  const baseURL = 'https://restful-booker.herokuapp.com';

  const bookingData = {
    "firstname" : "Jim",
    "lastname" : "Brown",
    "totalprice" : 111,
    "depositpaid" : true,
    "bookingdates" : {
        "checkin" : "2018-01-01",
        "checkout" : "2019-01-01"
    },
    "additionalneeds" : "Breakfast"
};
 
let bookingId = 1079;

let authToken = "266d8bdadfb746f";


  test('Создание бронирования', async ({ request }) => {
    // Отправляем POST-запрос
    const response = await request.post(`${baseURL}/booking`, {
        data : bookingData,
    });

    // Проверка 1: Статус-код ответа
    console.log(`Статус-код: ${response.status()}`);
    expect(response.status()).toBe(200);

       // Проверка 2: В ответе возвращаются те же данные, что и в запросе
    const responseBody = await response.json();
    console.log('Тело ответа:', responseBody);
    expect(responseBody.booking).toMatchObject(bookingData);

    // Проверка 3: В ответе есть объекты с ключом 'bookingid'
    expect(responseBody).toHaveProperty('bookingid');


  });

  test('Получение информации о бронировании', async ({ request }) => {
  
      // Отправляем get-запрос
      const response = await request.get(`${baseURL}/booking/${bookingId}`);
  
      // Проверка 1: Статус-код ответа
      console.log(`Статус-код: ${response.status()}`);
      expect(response.status()).toBe(200);
  
         // Проверка 2: В ответе cоответствуют данным в первом тесте
      const responseBody = await response.json();
      console.log('Тело ответа:', responseBody);
      expect(responseBody).toMatchObject(bookingData);
  
        });
  
      test('Обновление бронирования', async ({ request }) => {
      
      const authData = {
      "username" : "admin",
      "password" : "password123",
      };
  
      const authResponse = await request.post(`${baseURL}/auth`, {
          data : authData
      });
  
      const authBody = await authResponse.json()
  
      const authToken = authBody.token;
      console.log(authToken);
  
  
      const newBookingData = {
      "firstname" : "John",
      "lastname" : "Brown",
      "totalprice" : 666,
      "depositpaid" : true,
      "bookingdates" : {
          "checkin" : "2018-01-01",
          "checkout" : "2019-01-01"
      },
      "additionalneeds" : "Breakfast"
  };
  
      // Отправляем put-запрос
      const response = await request.put(`${baseURL}/booking/${bookingId}`, {
          data: newBookingData, headers: {
      'Cookie': `token=${authToken}`
      }
      });
  
      // Проверка 1: Статус-код ответа
      console.log(`Статус-код: ${response.status()}`);
      expect(response.status()).toBe(200);
  
         // Проверка 2: В ответе содержатся обновленные данные
      const responseBody = await response.json();
      console.log('Тело ответа:', responseBody);
      expect(responseBody).toMatchObject(newBookingData);
  
        });
  
      test('Удаление бронирования', async ({ request }) => {
      
      // Отправляем delete-запрос
      const response = await request.delete(`${baseURL}/booking/${bookingId}`, {
          headers: {
          'Cookie': `token=${authToken}`
      }
      });
  
      // Проверка 1: Статус-код ответа
      console.log(`Статус-код: ${response.status()}`);
      expect(response.status()).toBe(201);
  
      // Проверка 2: дополнительная, что бронирования нет
      const addCheck = await request.get(`${baseURL}/booking/${bookingId}`);
      console.log(`Статус-код: ${addCheck.status()}`);
      expect(addCheck.status()).toBe(404);
      });  
});
