# Базовый образ с Node.js
FROM node:20-alpine

# Установка рабочей директории
WORKDIR /app

# Копирование package.json и package-lock.json
COPY package*.json ./

# Установка зависимостей
RUN npm install

# Копирование исходного кода приложения
COPY . .

# Порт, на котором работает приложение
EXPOSE 4225

# Команда для запуска приложения
CMD ["npm", "run", "dev"]