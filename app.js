function attachEvents() {
    let baseUrl = 'http://localhost:3030/jsonstore/phonebook';

    let ulPhonebookEl = document.querySelector('#phonebook')
    let loadBtn = document.querySelector('#btnLoad')
    let createBtn = document.querySelector('#btnCreate')

    let personInputEl = document.querySelector('#person')
    let phoneInputEl = document.querySelector('#phone')

    loadBtn.addEventListener('click', () => {

        let data = getPhonebooks();
        data.then(d => {
            createListPhonebook(d)
        })
            .catch(err => {
                console.log('What?')
            })

    })
    createBtn.addEventListener('click', createNewContact)

    async function getPhonebooks() {
        try {
            let result = await fetch(baseUrl);
            let data = await result.json();

            return data;

        } catch (error) {

            console.log('We have some error!')
        }

    }

    async function createNewContact() {
        try {

            let currPerson = personInputEl.value;
            let currPhone = phoneInputEl.value;

            await fetch(baseUrl, {

                method: 'POST',
                headers: {
                    'Content-Type': 'Application/json'
                },
                body: JSON.stringify({

                    person: currPerson,
                    phone: currPhone,
                })
            })

            personInputEl.value = '';
            phoneInputEl.value = '';


        } catch (error) {

            console.log('We have error!')
        }


    }

    function createListPhonebook(data) {

        Object.values(data).forEach(el => {

            let liEl = document.createElement('li');
            let deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', deleteContact);

            let ulElementsArr = Array.from(ulPhonebookEl.childNodes);


            if (!ulElementsArr.some(x => x.textContent.includes(`${el.person}: ${el.phone}`))) {

                liEl.textContent = `${el.person}: ${el.phone}`;
                liEl.appendChild(deleteBtn);

                ulPhonebookEl.appendChild(liEl);

            }

        })

    }

    async function deleteContact(e) {

        let data = await getPhonebooks();
        let id = '';
        Object.values(data).forEach(el => {

            console.log(el)

            if (e.target.parentNode.textContent.includes(el.person && el.phone)) {

                id = el._id;
            }

        })

        let res = await fetch(`${baseUrl}/${id}`, {

            method: 'DELETE',

        })

        e.target.parentNode.remove();


    }

}

attachEvents();

