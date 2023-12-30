if (page.index) {
    const $index = $(page.index)
    if ($index) {
        /**
         * Selector
         */
        let sForm = {
            create: 'form.create',
            delete: 'form.delete',
            edit: 'form.edit',
        }

        const form = (selector, _clouses = {}) => {
            let $form = $(selector)
            localStorage.setItem(selector, $form.serialize())

            return {
                update: () => {
                    if (typeof _clouses.checkEdited === 'function') {
                        _clouses.checkEdited(((a) => {
                            return undefined
                        })())
                    }
                }
            }
        }

        if (sForm.create) {
            let $form = $(sForm.create)
            if ($form) {
                let inputschanged = []
                let $btnCancle = $form.find('.btn.form-cancle')
                let $btnSubmit = $form.find('.btn.form-submit')
                let $btnReset = $form.find('.btn.form-reset')
                let $inputs = $form.find('*[name]')

                $btnSubmit.attr('disabled', inputschanged.length == 0)
                $inputs.each((_index, el) => el.setAttribute('data-tag', el.value))
                $inputs.on('blur click', (e) => {
                    if (e.target.type == 'checkbox' && e.type == 'click') {
                        form(sForm.create, {
                            checkEdited: (res) => {
                                console.log(res)
                            }
                        }).update()
                    }

                    if (e.target.type != 'checkbox' && e.type == 'blur') {
                        let i = localStorage.getItem(form.create)
                        let c = $form.serialize()
                        if (i != c) {
                            console.log('data changed')
                        } else {
                            console.log('not change')
                        }
                    }
                })
            }
        }
    }
}