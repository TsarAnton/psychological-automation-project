# Установка проекта
1. git clone https://github.com/TsarAnton/psychological-automation-project.git
2. npm install (установка зависимостей)
4. создать файл .env
# Запуск проекта
1. npm run start
2. npm run start:dev (запуск в режиме разработчика)
3. swagger: {host}:{port}/api (по умолчанию localhost:3000/api)
   >>
   `
   Сортировка и панинация в swagger не работают, потому что они сделаны с помощью классов PaginationDto и SortingDto, которые потом передаются в другие DTO классы. Эти классы передаются в Query, а так как они являются объектами, они передаются следующим образом: http://localhost:3000/users?pagination[page]=1&pagination[size]=3. Но swagger как бы "деструктуризирует" объекты в Query и они передаются следующим образом: http://localhost:3000/users?page=1&size=3, т.е. вставляет их как обычные поля, а не объекты. Так что swagger используется как документация, а для тестирования api используется postman.
   `
# Миграции
* npm run migration:run - выполнить миграции
* npm run migration:generate - сгенерировать миграции
* npm run migration:create - создать пустой файл с миграциями
* npm run migration:revert - отменить миграции
# Схема базы данных
* [Схема БД](https://lucid.app/lucidchart/bf056a53-f57f-44bd-8110-28313b3bcff2/view)
* [Пример заполнения БД](https://lucid.app/lucidchart/10cc6d34-94cd-4c05-8f99-400608678a1a/view)
# Модули приложения
[UML диаграмма классов](https://drive.google.com/file/d/1iaGYhP-oC75ficgbyTJ0NyYnCRa1LHN3/view?usp=drive_link)
