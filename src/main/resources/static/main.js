const usersURL = 'http://localhost:8080/users'

getAllUsers()

function getRequest(url) {

    return fetch(url).then(response => {
        if (response.ok) {
            return response.json()
        } else {
            return response.json().then(error => {
                const e = new Error('Something is wrong')
                e.data = error
                throw e
            })
        }
    })
}

function sendRequest(method, url, body = null) {

    return fetch(url, {
        method: method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(body),
        contentType: 'application/json'

    }).then(response => {
        console.log(response);
        if (response.ok) {
            return response.json()
        } else {
            return response.json().then(error => {
                const e = new Error('Something is wrong')
                e.data = error
                throw e
            })
        }
    })
}

function getAllUsers() {
    getRequest(usersURL)
        .then(users => {
            console.log(users)
            for (let user of users) {
                $('#usersTable').append(createRow(user))
            }
        })
        .catch(err => alert('Failed to get users list' + err))
}

function createRow(user) {
    let userRoles = ''
    switch (user.roleInd) {
        case 1 :
            userRoles = "ADMIN"
            break;
        case 2 :
            userRoles = "USER"
            break;
        case 3 :
            userRoles = "ADMIN USER"
            break;
    }

    let usersTableRow = `
    <tr id="${user.id}">
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.surname}</td>
        <td>${user.email}</td>
        <td>${user.age}</td>
        <td>${userRoles}</td>
        <td>    
            <div class="btn-group" role="group" aria-label="Basic mixed styles example">
                <button type="submit" class="btn btn-info"
                    id="${user.id}"
                    data-ed-id="${user.id}"
                    data-ed-name="${user.name}"
                    data-ed-surname="${user.surname}"
                    data-ed-email="${user.email}"
                    data-ed-password="${user.password}"
                    data-ed-age="${user.age}"
                    data-ed-roles="${user.roleInd}">Edit
                </button>
                <button class="btn btn-danger" data-toggle="modal"
                    id="modal_${user.id}"
                    data-del-id="${user.id}"
                    data-del-name="${user.name}"
                    data-del-surname="${user.surname}"
                    data-del-email="${user.email}"
                    data-del-password="${user.password}"
                    data-del-age="${user.age}"
                    data-del-roles="${user.roleInd}">Delete
                </button>
            </div>
        </td>
    </tr>
    `

    return usersTableRow
}

//EDIT MODAL
$(document).on('click', '.btn-group .btn-info', function (event) {

    event.preventDefault();

    let button = $(this)
    let id = button.data('edId')
    let name = button.data('edName')
    let surname = button.data('edSurname')
    let email = button.data('edEmail')
    let password = button.data('edPassword')
    let age = button.data('edAge')
    let roles = button.data('edRoles')

    let myModal = $('#editModal')
    $('.modal-title').text('Edit user with ID = ' + id)
    $('#editId').val(id)
    $('#editName').val(name)
    $('#editSurname').val(surname)
    $('#editEmail').val(email)
    $('#editPassword').val(password)
    $('#editAge').val(age)
    $('#editRoles').val(roles)


    myModal.modal('show')
});


//DELETE MODAL

$(document).on('click', '.btn-group .btn-danger', function (event) {

    event.preventDefault();

    let delbutton = $(this)
    let id = delbutton.data('delId')
    let name = delbutton.data('delName')
    let surname = delbutton.data('delSurname')
    let email = delbutton.data('delEmail')
    let password = delbutton.data('delPassword')
    let age = delbutton.data('delAge')
    let roles = delbutton.data('delRoles')

    let delModal = $('#deleteModal')
    $('.modal-title').text('Delete user with ID = ' + id)
    $('#deleteId').val("" + id)
    $('#deleteName').val(name)
    $('#deleteSurname').val(surname)
    $('#deleteEmail').val(email)
    $('#deletePassword').val(password)
    $('#deleteAge').val(age)
    $('#deleteRoles').val(roles)


    delModal.modal('show')
})

//SUBMIT BUTTONS

$(document).on('click', '#editSubmit', async (event) => {
    event.preventDefault();
    let userEditId = $('#editId').val();
    let editUser = {
        name: $('#editName').val(),
        id: $('#editId').val(),
        age: $('#editAge').val(),
        surname: $('#editSurname').val(),
        email: $('#editEmail').val(),
        password: $('#editPassword').val(),
        roleInd: $('#editRoles').val()
    }
    console.log(editUser)

    await sendRequest('PUT', usersURL, editUser).then(data => {
        let newRow = createRow(data)
        console.log(data)
        $('#usersTable').find('#' + userEditId).replaceWith(newRow);
        $('#editModal').modal('hide');
        $('#v-pills-home-tab').tab('show');
    })
})

$(document).on('click', '#deleteSubmit', function (event) {
    event.preventDefault()
    let delUserId = $('#deleteId').val()
    const delURL = usersURL + '/' + delUserId
    console.log('DELETE URL: ' + delURL)
    fetch(delURL, {
        method: 'DELETE'
    }).then(() => {

        $('#' + delUserId).remove()
        $('#deleteModal').modal("hide")
        $("#v-pills-home-tab").tab('show')

    }).catch(error => {
        alert('Failed to delete user ' + error)
    })
})

//NEW USER

$(document).on('click', '#saveButton', function (event) {

    event.preventDefault()

    let name = $('#inputName')
    let surname = $('#inputSurname')
    let pass = $('#inputPass')
    let email = $('#inputEmail')
    let age = $('#inputAge')
    let roles = $('#selectRoles')

    let newUser = {
        name: name.val(),
        surname: surname.val(),
        password: pass.val(),
        email: email.val(),
        age: age.val(),
        roleInd: roles.val()
    }

    console.log(newUser);


    sendRequest('POST', usersURL, newUser).then(user => {
        $('#usersTable').append(createRow(user))
    })

    name.empty().val('')
    surname.empty().val('')
    pass.empty().val('')
    email.empty().val('')
    age.empty().val('')
    roles.val(2)

    $('#nav-home-tab').tab('show');


})