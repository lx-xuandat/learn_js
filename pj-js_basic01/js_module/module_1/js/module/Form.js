import { REGEX } from './Config.js'

export const Form = (() => {
    const caseRules = {
        email: (model, fieldName, fieldValue, ruleName, ruleValue) => {
            let regexEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

            if (!fieldValue.match(regexEmail)) {
                return 'Email required!'
            }
        },
        phone: (model, fieldName, fieldValue, ruleName, ruleValue) => {
            let regexPhone = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
            if (!fieldValue.match(regexPhone)) {
                return 'Phone required!'
            }
        },
        min: (model, fieldName, fieldValue, ruleName, ruleValue) => {
            if (fieldValue.length < ruleValue) {
                return fieldName + ' yeu cau it nhat ' + ruleValue + ' ki tu.'
            }
        },
        max: (model, fieldName, fieldValue, ruleName, ruleValue) => {
            if (fieldValue.length > ruleValue) {
                return fieldName + ' yeu cau toi da ' + ruleValue + ' ki tu.'
            }
        },
        required: (model, fieldName, fieldValue, ruleName, ruleValue) => {
            if (fieldValue.length <= 0) {
                return fieldName + ' khong duoc bo trong.'
            }
        },
        checked: (model, fieldName, fieldValue, ruleName, ruleValue) => {
            if (fieldValue !== 'on') {
                return fieldName + ' yeu cau phai duoc checked.'
            }
        },
        same: (model, fieldName, fieldValue, ruleName, ruleValue) => {
            return model[ruleValue] !== model[fieldName] ? '2 truong ko khop data.' : undefined
        },
        default: (model, fieldName, fieldValue, ruleName, ruleValue) => {
            if (!model[fieldName]) {
                return fieldName + ' yeu cau phai gui len.'
            }
        }
    }

    const validate = (model = {}, requestRules = {}) => {
        const _errors = {}

        for (const nInput in requestRules) {
            const rules = (requestRules[nInput] + '|').split('|')
            const nullable = rules.includes('nullable') ? true : false

            if (rules) {
                rules.find((rule) => {
                    const [nRule, vRule] = rule.split(':')
                    const vInput = typeof model[nInput] === 'string' ? model[nInput].mbTrim() : ''
                    const handleCaseValidator = caseRules[nRule] || caseRules.default

                    if (((nullable && vInput) || !nullable) && nRule) {
                        let message = handleCaseValidator(
                            model,
                            nInput,
                            vInput,
                            nRule,
                            vRule
                        )

                        if (message) {
                            _errors[nInput + '.' + nRule] = message
                        }
                    }
                })
            }
        }

        return Object.keys(_errors).length === 0 ? true : _errors
    }

    /**
     * Default headers for ajax request
     */
    const defaultHeaders = {
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json',
    }

    /**
     * Try to get array data by serialize from the form
     * If can't, return empty array instead.
     * 
     * @param {string} formSelector
     * @returns array
     */
    const getAttributes = (formSelector) => {
        try {
            return $(formSelector).serializeArray()
                .reduce(function (obj, item) {
                    obj[item.name] = item.value
                    return obj
                }, {})
        } catch (e) {
            return []
        }
    }

    const destroy = (url, id) => {

    }

    return { getAttributes, delete: destroy, validate }
})()