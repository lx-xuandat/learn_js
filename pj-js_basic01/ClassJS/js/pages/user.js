import User from '../src/Models/User.js';
import UserService from '../src/Services/UserService.js';

class UI {
    static showUser() {
        let users = UserService.getUsers()
    }

    static submitUser() {
        // UserService.
    }

    static validate() {
        return new Promise((resolve, reject) => {
            resolve('Success!');
        });
    }
}

(function (_init) {
    _init(window.jQuery, window, document);
}(function ($, window, document) {
    $(function () {
        UI.showUser()

        UI.validate().
            then(e => {
                console.log(e);
            })
    });
}));
