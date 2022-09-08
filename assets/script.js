//Show to admin

var vacancies = [];
var errors = {};

const addForm = document.querySelector('#add_form');
const searchInput = document.querySelector('#search-input');
const loginPageContainer = document.querySelector(".login-page");
const toAdminContainer = document.querySelector(".to-admin");
const toClientContainer = document.querySelector(".to-client");



addForm.addEventListener("submit", (e) => {
    e.preventDefault();
    deleteErrors(errors);
    let formData = getFormData(e);

    if (!validateFormData(formData)) {
        let types = addForm.getAttribute("name");
        if (types == 0) {
            addVacancy(formData);
            emptyForm(e);
            generateUI();
        }

    } else {
        addErrors(errors);
    }

});



//vacansies
class Vacancy {
    constructor({ id, name, category }) {
        this.id = id;
        this.name = name;
        this.category = category;
    }
    save() {
        vacancies.push(this);
        return this.get();
    }
    get() {
        return {
            id: this.id,
            name: this.name,
            category: this.category
        };
    }
}

//CRUD operations
function addVacancy(credentials) {

    return (new Vacancy(credentials)).save();
}

function deleteVacancy(e) {
    let vacancy_id = Number(e.id.split("_").pop());
    vacancies = vacancies.filter((vacancy) => vacancy.id !== vacancy_id);
    generateUI();
}


function editVacancy(credentials, selectedVacancy) {
    selectedVacancy.name = credentials.name;
    selectedVacancy.surname = credentials.category;

    let objIndex = vacancies.findIndex((vacancy => vacancy.id == selectedVacancy.id));

    vacancies[objIndex] = selectedVacancy;
}

//search operation
function search(e) {
    let name = e.target.value;
    if (name.length) {
        let searched = vacancies.find(vacancy => vacancy.name.includes(name));
        generateUI([searched]);
    } else {
        generateUI([]);
    }
}

searchInput.addEventListener("keyup", search);



function getFormData(e, vacancy_id) {

    let childElements = Array.from(e.target.children);
    // Remove button
    childElements.pop();
    let obj = {};

    childElements.map(child => {
        let id = child.lastElementChild.id;
        let value = child.lastElementChild.value;
        obj[id] = value;
        obj["id"] = vacancy_id ? vacancy_id : vacancies[vacancies.length - 1] ? (vacancies[vacancies.length - 1].id + 1) : 1;
    });

    return obj;
}

function emptyForm(e) {
    let childElements = Array.from(e.target.children);
    childElements.pop();
    childElements.map(child => {
        child.lastElementChild.value = '';
    });
}

//errors
function addErrors(errors) {
    Object.keys(errors).map(key => {
        let errSpan = document.createElement("span");
        errSpan.style.color = "red";
        errSpan.textContent = errors[key];
        document.getElementById(key).parentElement.append(errSpan);
    })
}

function deleteErrors(err) {
    Object.keys(err).map(key => {
        document.getElementById(key).parentElement.lastElementChild.remove();
    });
    errors = {}
}

function checkErrors(errors) {
    return Object.keys(errors).length ? true : false;
}

function getRowData(e) {
    let vacancy_id = Number(String(e.id).split("_").pop());
    fillForm({ ...vacancies.filter((vacancy) => vacancy.id === vacancy_id)[0] }, vacancy_id, vacancies.filter((vacancy) => vacancy.id === vacancy_id)[0]);
    addForm.lastElementChild.textContent = "edit";
    addForm.setAttribute("name", "1");
}

function fillForm(selected, vacancy_id, vacancy) {
    let selectedVacancy = selected;
    Array.from(addForm.children).map(e => {
        let element = e.lastElementChild
        if (element && element.id && selectedVacancy[element.id]) {
            if (element.type == "number") {
                element.value = selectedVacancy[element.id];
                return;
            }
            element.value = selectedVacancy[element.id];
        }
    });
    addForm.addEventListener("submit", (e) => {
        e.preventDefault();
        deleteErrors(errors);
        let formData = getFormData(e, vacancy_id);

        let types = addForm.getAttribute("name");
        if (types == "0") {
            addVacancy(formData);
            emptyForm(e);
            generateUI();
        } else if (types == "1") {
            editVacancy(formData, vacancy);
            emptyForm(e);
            generateUI();
        }

    });
}

//generation of UI
function generateUI(searched = []) {
    const tableBody = document.getElementById("table_body");
    const tableHead = document.getElementById("tr_head");
    const tableBodyForClient = document.getElementById("table_body_client");
    const tableHeadForClient = document.getElementById("tr_head_client");
    addForm.lastElementChild.textContent = "submit";

    tableHead.innerHTML = "";
    tableBody.innerHTML = "";
    tableBodyForClient.innerHTML = "";
    tableHeadForClient.innerHTML = "";

    let list = searched.length ? searched : vacancies;

    if (list.length) {
        Object.keys(vacancies[0]).forEach(key => {
            const th = document.createElement("th");

            th.textContent = key;

            tableHead.append(th);
            tableHeadForClient.append(th);
        });
        list.forEach(vacancy => {
            if (vacancy && Object.keys(vacancy).length) {
                const trBody = document.createElement("tr");

                trBody.addEventListener("click", getRowData);

                trBody.innerHTML = `
                    <td scope="row">${vacancy.id}</td>
                    <td>${vacancy.name}</td>
                    <td>${vacancy.category}</td>
                    <td>
                        <button id="edit_${vacancy.id}" onclick="getRowData(this)" type="button" class="btn btn-warning"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button id="delete_${vacancy.id}" onclick="deleteVacancy(this)" type="button" class="btn btn-danger"><i class="fa-solid fa-trash"></i></button>
                    </td>
                `;
                tableBody.append(trBody);
                // tableBodyForClient.append(trBody);
            }
        });

        list.forEach(vacancy => {
            if (vacancy && Object.keys(vacancy).length) {
                const trBody = document.createElement("tr");

                trBody.addEventListener("click", getRowData);

                trBody.innerHTML = `
                    <td scope="row">${vacancy.id}</td>
                    <td>${vacancy.name}</td>
                    <td>${vacancy.category}</td>
                `;
                // tableBody.append(trBody);
                tableBodyForClient.append(trBody);
            }
        });
    }
    else {
        tableBody.innerHTML = "Data not found"

    }
}

function validateFormData(formData) {
    let err = errors;
    Object.keys(formData).map(key => {
        if (!String(formData[key])) {
            err[key] = "Can not be blank";
        }
    });

    errors = err;
    return checkErrors(err);
}









//Login part


//users
const users = [
    {
        id: 1,
        login: 'admin1',
        password: '12345',
        isAdmin: true
    },
    {
        id: 2,
        login: 'admin2',
        password: '12345',
        isAdmin: true
    },
    {
        id: 3,
        login: 'client1',
        password: '12345',
        isAdmin: false
    },
    {
        id: 4,
        login: 'client2',
        password: '12345',
        isAdmin: false
    },
]


document.querySelector("#loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    login();
});

function login() {
    const loginTry = document.getElementById("username").value;
    const passTry = document.getElementById("password").value;
    const checkedUser = users.find(user => {
        return user.login === loginTry && user.password === passTry
    })


    if (checkedUser.isAdmin) {
        loginPageContainer.style.display = "none";
        toClientContainer.style.display = "none";
        toAdminContainer.style.display = "block";
    }
    else {
        loginPageContainer.style.display = "none";
        toAdminContainer.style.display = "none";
        toClientContainer.style.display = "block";
    }

    loginTry = "";
    passTry = "";

}


//logout part

const logOutButton = document.querySelectorAll(".logout");

logOutButton.forEach(btn=>{
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        logOut();
    })
})


function logOut() {
    loginPageContainer.style.display = "block";
    toAdminContainer.style.display = "none";
    toClientContainer.style.display = "none";

    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
}

//Show to client


const searchInputForClient = document.querySelector("#search-input_client");

//Many to many relation

var userVacancies = [];

class UserVacancy {
    constructor({ id }) {
        this.id = id;
        this.userId = users.find(user =>user.login === document.getElementById("username").value && user.password === document.getElementById("password").value);
        this.vacancyId = vacancyId;
    }
    save() {
        userVacancies.push(this);
        return this.get();
    }
    get() {
        return {
            id: this.id,
            userId: this.userId,
            vacancyId: this.vacancyId
        };
    }
}