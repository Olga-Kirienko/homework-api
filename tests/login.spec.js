// Импортируем 'test' и 'expect' из библиотеки Playwright
const { test, expect } = require('@playwright/test');

// Описываем наш набор тестов
test.describe('Авторизация на Sauce Demo', () => {

  // Создаем тест-кейс
  test('@ui Пользователь должен успешно войти в систему', async ({ page }) => {
    // 1. Переходим на страницу
    await page.goto('https://www.saucedemo.com/');

    // 2. Вводим логин
    await page.getByPlaceholder('Username').fill('standard_user');

    // 3. Вводим пароль
        await page.getByPlaceholder('Password').fill('secret_sauce');

    // 4. Нажимаем кнопку входа
    await page.getByRole('button', { name: 'Login' }).click();

    // 5. Проверяем, что URL изменился и содержит нужную часть
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });
});


test.describe('Сценарий неуспешного входа', () => {

  // Создаем еще один тест-кейс
  test('@ui Пользователь заблокирован', async ({ page }) => {
    // 1. Переходим на страницу
    await page.goto('https://www.saucedemo.com/');

    // 2. Вводим логин
    await page.getByPlaceholder('Username').fill('locked_out_user');

    // 3. Вводим пароль
        await page.getByPlaceholder('Password').fill('secret_sauce');

    // 4. Нажимаем кнопку входа
    await page.getByRole('button', { name: 'Login' }).click();

    // 5. Проверяем, что на странице появилось сообщение с текстом
    await expect(page.getByText('Epic sadface: Sorry, this user has been locked out.')).toBeVisible()
  });
});