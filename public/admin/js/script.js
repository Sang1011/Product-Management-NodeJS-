// button status

const buttonStatus = document.querySelectorAll("[button-status]");
// đối với những class tự định nghĩa thì dùng [tên]
if (buttonStatus.length > 0) {
    let url = new URL(window.location.href);

    buttonStatus.forEach(button => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");
            if (status) {
                url.searchParams.set("status", status);
            } else {
                url.searchParams.delete("status");
            }
            window.location.href = url.href;
        });
    });
}

// end button status

// form search

const formSearch = document.querySelector("#form-search");
if (formSearch) {
    let url = new URL(window.location.href);
    formSearch.addEventListener("submit", (event) => {
        event.preventDefault();
        // ngăn sự kiện xảy ra
        const keyword = event.target.elements.keyword.value;
        if (keyword) {
            url.searchParams.set("keyword", keyword);
        } else {
            url.searchParams.delete("keyword");
        }
        window.location.href = url.href;
    })
}

// pagination

const buttonPagination = document.querySelectorAll("[button-pagination]");
let url = new URL(window.location.href);
if (buttonPagination.length > 0) {
    buttonPagination.forEach(button => {
        button.addEventListener("click", () => {
            const pageCurrent = button.getAttribute("button-pagination");
            if (pageCurrent) {
                url.searchParams.set("page", pageCurrent);
            } else {
                url.searchParams.delete("page");
            }
            window.location.href = url.href;
        })
    });


}

// end pagination

// check box multi

const checkedChange = (inputsId, status) => {
    inputsId.forEach((input) => {
        input.checked = status;
    });
};

const checkBoxMulti = document.querySelector("[checkbox-multi]");
if (checkBoxMulti) {
    const inputCheckAll = checkBoxMulti.querySelector("input[name='checkall']");
    const inputsId = checkBoxMulti.querySelectorAll("input[name='id']");

    inputCheckAll.addEventListener("click", () => {
        if (inputCheckAll.checked) {
            checkedChange(inputsId, true);
        } else {
            checkedChange(inputsId, false);
        }
    });

    inputsId.forEach((input) => {
        input.addEventListener('click', () => {
            const countChecked = checkBoxMulti.querySelectorAll("input[name='id']:checked").length;
            if (countChecked == inputsId.length) {
                inputCheckAll.checked = true;
            } else {
                inputCheckAll.checked = false;
            }
        })
    })
}
// end check box multi

// form change multi

const formChangeMulti = document.querySelector('[form-change-multi]');
if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();

        const checkBoxMulti = document.querySelector("[checkbox-multi]");
        const inputsChecked = checkBoxMulti.querySelectorAll(
            "input[name='id']:checked"
        );

        const typeChange = e.target.elements.type.value;
        if (typeChange == "delete-all") {
            const isConfirm = confirm("Bạn có thật sự muốn xóa những sản phẩm này?");
            if (!isConfirm) {
                return;
            }
        }

        if (inputsChecked.length > 0) {
            let ids = [];
            const inputIds = formChangeMulti.querySelector("input[name='ids']");

            inputsChecked.forEach(input => {
                const id = input.value;

                if (typeChange == "change-position") {
                    const position = input.closest("tr").querySelector("input[name='position']").value;
                    ids.push(`${id}-${position}`);
                } else {
                    ids.push(id);
                }
            });
            inputIds.value = ids.join(", ");

            formChangeMulti.submit();
        } else {
            alert("Vui lòng chọn ít nhất 1 sản phẩm");
        }
    });
}

// end form change

// show alert

const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
    const time = parseInt(showAlert.getAttribute("data-time"));
    const closeAlert = showAlert.querySelector("[close-alert]");


    setTimeout(() => {
        showAlert.classList.add("alert-hidden");
    }, time);

    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden");
    });
}

// end show alert