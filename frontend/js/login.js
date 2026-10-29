const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const username =
        document.getElementById("username").value;

    const password =
        document.getElementById("password").value;

    if (username && password) {

        window.location.href = "dashboard.html";

    }

});


function startExpoDemo() {

    sessionStorage.setItem(
        "acuvisionDemoMode",
        "true"
    );

    window.location.href = "dashboard.html";

}