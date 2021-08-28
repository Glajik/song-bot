# Song-Book
Service for creating collections of songs. It includes a web client, a mobile application and, in the future, a telegram bot.

## Set Telegram Token as an environment variable

To avoid using the secret key (the Telegram token is a secret key) within our code we can set up the Telegram token as an environment variable for your Firebase project. Once you’ve got the token from the Botfather bot, we can add this value to the Firebase config:

    firebase functions:config:set telegram.token="<telegram-token-string>"
