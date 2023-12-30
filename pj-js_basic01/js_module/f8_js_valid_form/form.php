<?php

if ($_POST) {
    print_r($_POST);
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <title>Bootstrap Example</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/css/bootstrap.min.css">
    <script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/js/bootstrap.bundle.min.js"></script>
</head>

<body>

    <div id="p-index" class="container">
        <h2>Stacked form</h2>
        <form class="create" name="posts.store" method="Post">
            <div class="form-group">
                <label for="email">Email:</label>
                <input
                    class="form-control"
                    id="email"
                    name="email"
                    placeholder="Enter email"
                    type="email"
                    value="datlx@mail.com"/>
            </div>
            <div class="form-group">
                <label for="pwd">Password:</label>
                <input
                    class="form-control"
                    id="pwd"
                    name="pswd"
                    placeholder="Enter password"
                    type="password"
                    value="password"/>
            </div>
            <div class="form-group form-check">
                <label class="form-check-label">
                    <input
                        type="checkbox"
                        value="a"
                        class="form-check-input"
                        id="check"
                        name="setting[b]"/>
                        Setting A
                </label>
<br>
                <label class="form-check-label">
                    <input
                        type="checkbox"
                        value="b"
                        class="form-check-input"
                        id="check1"
                        name="setting[a]"/>
                        Setting B
                </label>
            </div>
            <a href="/" class="btn btn-primary form-cancle"> Back </a>
            <input type="submit" id="submit" class="btn btn-primary form-submit" value="Submit">
        </form>
    </div>

    <script src="/js/app.js"></script>
    <script src="/js/resources/index.js"></script>
</body>

</html>