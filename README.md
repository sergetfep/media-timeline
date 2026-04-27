# Timeline

Решение домашнего задания к занятию «10. Geolocation, Notification, Media».

Бейджик сборки: [![CI](https://github.com/sergetfep/media-timeline/actions/workflows/pages.yml/badge.svg?branch=main)](https://github.com/sergetfep/media-timeline/actions/workflows/pages.yml)

## Деплой

- Frontend опубликован на GitHub Pages: [Timeline](https://sergetfep.github.io/media-timeline/).

## Что сделано

- реализована лента текстовых записей;
- при отправке записи запрашиваются координаты через Geolocation API;
- если координаты получить не удалось, открывается модальное окно для ручного ввода;
- новые записи добавляются сверху;
- записи хранятся в памяти;
- добавлены тесты для функции разбора координат.

## Установка и запуск

```bash
npm i
npm start
```

## Проверка

```bash
npm run lint
npm test
npm run build
```

## Ссылка на задание

[10. Geolocation, Notification, Media](https://github.com/netology-code/ahj-homeworks/tree/AHJ-50/media)
