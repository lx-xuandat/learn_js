$inputs.on('change', (e) => {
    let el = $(e.target)

    if (el.attr('type') == 'checkbox') {
        el[0].checked == true ? el.val('ok') : el.val('no')
    }


    $btnSubmit.attr('disabled', inputschange.length == 0)
})


$inputs.on('change', (e) => {
    let name = e.target.name

    nodes[`${name}`] = {
        name: e.target.name,
        type: e.target.type,
        value: e.target.value,
        defaultValue: $(e.target).attr('data-tag'),
        checked: e.target.checked,
        defaultChecked: e.target.defaultChecked,
    }

    switch (nodes[`${name}`]['type']) {
        case 'checkbox':
            nodes[`${name}`]['value'] = 'off'
            $(`input[name="${name}"]`).val('off')
            if (nodes[`${name}`]['checked']) {
                nodes[`${name}`]['value'] = 'on'
                $(`input[name="${name}"]`).val('on')
            }
            break
    }

    for (let key in nodes) {
        inputschange.pop(key)
        if ((nodes[key].value != nodes[key].defaultValue)) {
            inputschange.push(key)
        }
    }
    $btnSubmit.attr('disabled', inputschange.length == 0)
})