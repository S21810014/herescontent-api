module.exports = {
    checkFields: (obj1, keysList) => {
        let foreignKeys = []
        let count = 0
        let err

        for(const key in obj1) {
            if(!keysList.includes(key))
                foreignKeys.push(key)
            count++
        }

        if (count < keysList.length)
            err = { result: `Form Incomplete, required fields [${keysList}]` }
        else if (foreignKeys.length > 0)
            err = { result: `Please do not specify '${foreignKeys[0]}'`}

        return err
    },

    errorFormatter: (error) => {
        switch(error.name) {
            case "SequelizeUniqueConstraintError": {
                return {
                    result: 'Object already exist'
                }
            }
            default: {
                return error
            }
        }
    }
}