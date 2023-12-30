import { Seller } from '../module/Seller.js'
import { Form } from '../module/Form.js'

$(() => {
    const $pageSeller = $('body')
    if ($pageSeller.length === 1) {

        /**
        * @selector Selector Form Login
        */
        const sltFormLogin = 'form'
        if ($(sltFormLogin).length === 1) {
            const btnSubmmit = sltFormLogin + ' button[type="submit"]'
            const handleValidate = (event) => {
                event.preventDefault()
                $(sltFormLogin + ' .invalid-feedback').text('')
                const attributes = Form.getAttributes(sltFormLogin)
                const messages = Form.validate(attributes, {
                    email: 'nullable|email|max:255',
                    // phone: 'required|phone',
                    password: 'required',
                    remember: 'checked'
                })

                if (messages !== true) {
                    for (const msgKey in messages) {
                        const feedback = messages[msgKey] ?? null
                        const fbKey = msgKey.split('.')[0]
                        $(sltFormLogin + ' .msg-' + fbKey)
                            .css('display', feedback ? 'block' : 'none')
                            .text(feedback)
                    }
                    return false
                } else {
                    return true
                }
            }
            $(sltFormLogin + ' *[name]').on('change', (event) => handleValidate(event))
            $(sltFormLogin).submit((event) => {
                event.preventDefault()
                if (handleValidate(event)) {
                    Seller.update(attributes, 1, {
                        fail: (res) => {

                        },
                        done: (xhr) => {

                        }
                    })
                }
            })
        }
        $pageSeller.on('click', sltFormUpdate, () => {
            
        })
    } else {
        debugger
    }
})