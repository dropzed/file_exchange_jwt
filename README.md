# File Sharing System with JWT Authentication

Это система обмена файлами с поддержкой JWT-авторизации, разделением приватных и публичных файлов, дополнительными возможностями администратора и логированием действий пользователей.

Для запуска через докер:

```bash
     docker compose up --build
```


1. [Описание](#описание)
2. [Функциональные возможности](#функциональные-возможности)
3. [Технологии](#технологии)
4. [Установка](#установка)
5. [Использование](#использование)
6. [API Документация](#api-документация)
7. [Логирование](#логирование)
8. [Авторы](#авторы)
9. [Лицензия](#лицензия)

## Описание

Это веб-приложение для обмена файлами с следующими ключевыми особенностями:
- **JWT-авторизация**: Пользователи могут регистрироваться и авторизовываться с использованием JSON Web Tokens.
- **Приватные и публичные файлы**: Пользователи могут загружать как приватные файлы (доступные только авторизованным пользователям, которые знают название файла), так и публичные файлы (доступные всем, которым сказали название файла :) ).
- **Админка**: Администратор (который создается по отдельному роуту) может получить список всех пользователей системы, при этом просто войти за админа не получится, нужно знать данные админа.
- **Логирование**: Все действия пользователей (загрузка файлов, удаление, просмотр) записываются в журнал, кроме действия админа.

## Функциональные возможности

- **Регистрация и авторизация**:
    - Регистрация и авторизация новых пользователей через JWT.

- **Обмен файлами**:
    - Загрузка файлов.
    - Скачивание файлов.
    - Разделение файлов на приватные и публичные.

- **Административные права**:
    - Администратор может получить список всех зарегистрированных пользователей.

- **Логирование**:
    - Логирование всех действий пользователей (загрузка, скачивание, удаление файлов).



## Технологии

- **Backend**: Node.js, Express.js
- **База данных**: Postgresql
- **Аутентификация**: JSON Web Tokens (JWT)
- **Хранение файлов**: Локальная файловая система
- **Логирование**: Логирование сделал вручную, я старался(


## Установка

1. Клонируйте репозиторий:
   ```bash
   git clone "ссылка на репозиторий"
   
2. Перейти в папку (через консоль):
   ```bash
   cd "name_repo"

3. Установить зависимости:
    ```bash
   npm install pg
   npm install

4. Создать .env файл, с необходимыми переменными окружения (получилось много):
   PORT,

   DB_HOST = db,

   DB_USER,

   DB_PASSWORD,

   DB_NAME,

   JWT_REFRESH_SECRET_KEY=jwt-example-refresh-key,

   JWT_ACCESS_SECRET_KEY=jwt-example-access-secret-key,

   SMTP_HOST=тут через почту нужно подключить smtp и ввести нужные данные,

   SMTP_PORT=тут через почту нужно подключить smtp и ввести нужные данные,

   SMTP_USER=почта,

   SMTP_PASSWORD=тут через почту нужно подключить smtp и ввести полученные пароль,

   API_URL=адрес апишки,

   CLIENT_URL=редирект на страницу активации (пока просто активируется при переходе),

   ALLOW_CREATE_ADMIN=true (тут можно менять, это разрешение на создание админа),




---

### 5. Использование
```markdown
## Использование

1. **Регистрация нового пользователя**:
   - Отправьте POST-запрос на `/api/register` с данными пользователя.
    - Отправьте POST-запрос на `/api/create-admin` с данными админа.

2. **Авторизация**:
   - Отправьте POST-запрос на `/api/login` с email и паролем. Получите JWT токен.

3. **Загрузка файла**:
   - Отправьте POST-запрос на `/api/upload` с файлом и параметром `isPrivate` (true/false).

4. **Скачивание файла**:
   - Отправьте GET-запрос на `/api/download/private/:filename`.
    - Отправьте GET-запрос на `/api/download/public/:filename`.

5. **Получение списка пользователей (админ)**:
   - Отправьте GET-запрос на `/api/admin/users` с токеном администратора.

```


---

## Автор

- **dropzed** 


## Лицензия

Я просто решил красиво оформить, кому это надо
