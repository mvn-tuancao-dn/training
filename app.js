var KEY_CATE = 'listCate';

let modalCreate = new bootstrap.Modal(document.getElementById('modalCreate'));
let modalDetails = new bootstrap.Modal(document.getElementById('modalDetails'));
let idForm = 0;


const form = document.querySelector('form')
const nameCate = document.getElementById("nameCate");
const slug = document.getElementById('slug');
const description = document.getElementById('description');
const showListCate = document.getElementById('showListCate');

btnCreate.addEventListener("click", () => {
    nameCate.value = '';
    slug.value = '';
    description.value = '';
    modalCreate.show();
    idForm = 0;
});

function renderListCate() {
    showListCate.innerHTML = '';
    let getItemCateLocal = JSON.parse(localStorage.getItem(KEY_CATE));
    if(getItemCateLocal){
        for(let i = 0; i < getItemCateLocal.length ; i++ ) {
            let cate = getItemCateLocal[i];
            showListCate.innerHTML += `
                <tr>
                    <td>${cate.id}</td>
                    <td>${cate.nameCate}</td>
                    <td>${cate.slug}</td>
                    <td class="actionButton">
                        <i class="fa fa-eye detailsCate" data-bs-toggle="modal"></i>
                        <i class="fas fa-edit editCate" data-bs-toggle="modal"></i>
                        <i class="fas fa-trash-alt removeCate"></i>
                    </td>
                </tr>
            `;
        }
    }
    setEventRemove();
    setEventDetails();
    setEventEdit();
}

window.onload = renderListCate();

function setItemCate(id){
    var itemCate = {
        id: id,
        nameCate:nameCate.value,
        slug: slug.value,
        description: description.value,
    };
    return itemCate;
}


function addCategory() {
    let listCate = JSON.parse(localStorage.getItem(KEY_CATE));
    if(listCate == null || listCate.length == 0) {
        listCate = [setItemCate(1)];
    }else{
        var id = parseInt(listCate[listCate.length-1].id);
        listCate.push(setItemCate(id+1));
    }
    localStorage.setItem(KEY_CATE, JSON.stringify(listCate));
    alertify.success('Create Category Success');
    modalCreate.hide();
    renderListCate(listCate);

}

function setEventRemove() {
    var buttonRemoveCate = document.getElementsByClassName('removeCate');
    var itemCate = JSON.parse(localStorage.getItem(KEY_CATE));
    for(let i = 0; i < buttonRemoveCate.length ; i++) {
        var buttons = buttonRemoveCate[i];
        buttons.addEventListener('click', function(event) {
            var buttonse = event.target;
            alertify.confirm('Admin', 'Are you sure to delete this record?',
            function(){ 
                buttonse.parentElement.parentElement.remove();
                removeItemCate(itemCate[i]);
                alertify.success('Delete Success') 
                }
            , function(){ alertify.error('Cancel')});
        });
    }
}



function removeItemCate(itemCate) {
    console.log(itemCate);
    var itemCates = JSON.parse(localStorage.getItem(KEY_CATE));
    console.log(itemCates);
    for( let i = 0; i < itemCates.length ; i++ ) {
        if(itemCates[i].id == itemCate.id) {       
            itemCates.splice(i, 1);
            break;
        }
    }
    localStorage.setItem(KEY_CATE, JSON.stringify(itemCates))
    if(itemCates.length == 0) {
        localStorage.removeItem(KEY_CATE);
    }
}


function setEventDetails() {
    var buttonDetailsCate = document.getElementsByClassName('detailsCate');
    var itemCate = JSON.parse(localStorage.getItem(KEY_CATE));
    for(let i = 0; i < buttonDetailsCate.length ; i++) {
        var buttons = buttonDetailsCate[i];
        buttons.addEventListener('click', function(event) {
            var buttonse = event.target;
            showItemCate(itemCate[i]);
            modalDetails.show();
        });
    }
}


function showItemCate(itemCate) {
    var modalDetails = document.getElementById('showItemCate');
    modalDetails.innerHTML = '';

    modalDetails.innerHTML += `
            <table class="table table-hover table-bordered" id="tableListItemCategory">
                <tr>
                    <th>ID</th>
                    <td>${itemCate.id}</td>
                </tr>
                <tr>
                    <th>Name</th>
                    <td>${itemCate.nameCate}</td>
                </tr>
                <tr>
                    <th>Slug</th>
                    <td>${itemCate.slug}</td>
                </tr>
                <tr>
                    <th>Description</th>
                    <td>${itemCate.description}</td>
                </tr>     
            </table>
    `;
}

// edit
function setEventEdit() {
    var buttonEditCate = document.getElementsByClassName('editCate');
    var itemCate = JSON.parse(localStorage.getItem(KEY_CATE));
    for(let i = 0; i < buttonEditCate.length ; i++) {
        var buttons = buttonEditCate[i];
        buttons.addEventListener('click', function(event) {
            var buttonse = event.target;
            editCate(itemCate[i]);
            modalCreate.show();
        });
    }
}


function editCate(itemCate) {
   nameCate.value = itemCate.nameCate;
   slug.value = itemCate.slug;
   description.value = itemCate.description;
   idForm = itemCate.id;
}

function updateCategory(idCate) {
    var itemCates = JSON.parse(localStorage.getItem(KEY_CATE));
    console.log(itemCates);
    for( let i = 0; i < itemCates.length ; i++ ) {
        if(itemCates[i].id == idCate) {       
            itemCates[i].nameCate = nameCate.value;
            itemCates[i].slug = slug.value;
            itemCates[i].description = description.value;
            break;
        }
    }
    localStorage.setItem(KEY_CATE, JSON.stringify(itemCates))
    alertify.success('Update Category Success');
    modalCreate.hide();
    renderListCate(itemCates);
}

function validate() {
    if(nameCate.value == null || nameCate.value == '') {
            nameCate.focus();
            const nameError = document.getElementById('nameCate-error');
            nameError.innerHTML = 'The name category is required!';
            return false;
    }
    if(slug.value == null || slug.value == '') {
            slug.focus();
            const slugError = document.getElementById('slug-error');
            slugError.innerHTML = 'The slug category is required!';
            return false;
    }
    if(description.value == null || description.value == '') {
            description.focus();
            const descriptionError = document.getElementById('description-error');
            descriptionError.innerHTML = 'The description category is required!';
            return false;
    }
    return true;
}

form.addEventListener("submit", function (e) {
    e.preventDefault();
    if(validate()){
        if (idForm == 0) {
            addCategory();   
        } else {
            updateCategory(idForm);
        }
    }
    
    setEventRemove();
    setEventDetails();
    setEventEdit();
});
