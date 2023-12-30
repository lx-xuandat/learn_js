export const Seller = ((baseURL) => {
    const header = {
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json',
    }

    const isValidUpdate = (() => {
        return true
    })()

    const isValidCreate = (() => {
        return true
    })()

    const create = (attributes = {}) => { }

    const update = (attributes = {}, id, handler = {}) => {
        const handleUpdateDone = (res) => {
            if (handler.done) {
                handler.fail(data)
            } else {
            }
        }

        const handleUpdateFail = (xhr) => {
            if (handler.done) {
                handler.fail(xhr)
            } else {
            }
        }

        $.ajax({
            url: baseURL + '/' + id,
            method: "PUT",
            headers: header,
            data: attributes,
        }).done(handleUpdateDone).fail(handleUpdateFail)
    }

    const destroy = (id) => { }

    return { create, update, delete: destroy, isValidUpdate, isValidCreate }
})('/sellers')
