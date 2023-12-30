import { api } from "../config/route.js";

export default class UserService {
  static getUsers() {
    let users;

    $.get(api.list_users, { page: 2 }, function (data, textStatus, jqXHR) {
      console.log(data);
      console.log(textStatus);
      console.log(jqXHR);

      jqXHR
        .done(res => {
          console.log('done');
        }).fail(res => {
          console.log('fail');
        }).abort(res => {
          console.log('abort');
        })
        .always(res => {
          console.log('always')
        })
        .catch(res => {
          console.log('res');
        })
    })

    return users
  }
}