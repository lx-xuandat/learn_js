function Validator(formSelector, options = {}) {
    // lay ra form trong DOM
    let formElement = document.querySelector(formSelector)
    let formRules = {}

    let validatorRules = {
        required: function (value) {
            return value ? undefined : 'Vui long nhap truong nay!'
        },
        email: function (value) {
            let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined : 'Vui long nhap email!'
        },
        min: function (min) {
            return function (value) {
                return value.length >= min ? undefined : `Vui long nhap it nhat ${min} ki tu`
            }
        },
        max: function (max) {
            return function (value) {
                return value.length <= max ? undefined : `Vui long nhap toi da ${max} ki tu`
            }
        }
    }

    let typeFunction = (option) => {
        return typeof option === 'function'
    }

    let getParentElement = (childElement, parentSelector) => {
        let parent = childElement.parentElement

        while (parent) {
            if (parent.matches(parentSelector)) {
                return parent
            }
            parent = parent.parentElement
        }
    }

    // Chi xu li logic khi co form
    if (formElement) {
        let inputs = formElement.querySelectorAll('[name][rules]')

        function handleValidate(event) {
            let rules = formRules[event.target.name]
            let errorMessage

            rules.find(function (rule) {
                return errorMessage = rule(event.target.value)
            })

            let formGroup = getParentElement(event.target, '.form-group')

            if (formGroup) {
                formGroup.classList.add('invalid')

                let formMessage = formGroup.querySelector('.form-message')
                if (formMessage) {
                    let hasInvalid = errorMessage != undefined

                    formMessage.innerText = hasInvalid ? errorMessage : null
                    formGroup.classList.toggle('invalid', hasInvalid)
                }
            }

            return !errorMessage
        }

        for (let input of inputs) {
            let rules = input.getAttribute('rules').split('|')

            for (rule of rules) {
                let ruleInfo
                let isRuleHasValue = rule.includes(':')

                if (isRuleHasValue) {
                    ruleInfo = rule.split(':')
                    rule = ruleInfo[0]
                }

                let ruleFunction = validatorRules[rule]

                if (isRuleHasValue) {
                    ruleFunction = ruleFunction(ruleInfo[1])
                }

                if (Array.isArray(formRules[input.name])) {
                    formRules[input.name].push(ruleFunction)
                } else {
                    formRules[input.name] = [ruleFunction]
                }
            }

            input.onblur = handleValidate
        }

        formElement.onsubmit = function (event) {
            event.preventDefault()
            let isInvalid = true
            for (let input of inputs) {
                if (!handleValidate({ target: input })) {
                    // console.log(input)
                    isInvalid = false
                    // break
                }
            }

            if (isInvalid) {
                if (typeFunction(options.onSubmit)) {
                    let inputElements = formElement.querySelectorAll('input[name]')
                    // console.log(inputElements)
                    let formValues = Array.from(inputElements).reduce(function (values, input) {
                        switch (input.type) {
                            case 'radio':
                                let radio = formElement.querySelector('input[name="' + input.name + '"]:checked')
                                values[input.name] = radio != undefined ? radio.value : null
                                break
                            case 'checkbox':
                                if (!input.matches(':checked')) {
                                    values[input.name] = ''
                                    console.log(input)
                                    return values
                                }

                                if (!Array.isArray(values[input.name])) {
                                    values[input.name] = []
                                }
                                values[input.name].push(input.value)
                                break
                            case 'file':
                                values[input.name] = input.files
                                break
                            default:
                                values[input.name] = input.value
                        }

                        return values
                    }, {})

                    return options.onSubmit(formValues)
                }

                return formElement.submit()
            } else {
                if (typeFunction(options.fail)) {
                    return options.fail({
                        status: 422,
                        message: 'Validate Đi Ông Cháu Ơi !!!'
                    })
                }
            }
        }
    }
}